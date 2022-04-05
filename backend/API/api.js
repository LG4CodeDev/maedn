/* ToDo´s:
        - create database if not existing
        - update database user table to a new data model
        - validate code by at least Tomasz
 */

const express = require('express');

const app = express();

const path = require('path');

const dotenv = require('dotenv');

dotenv.config({ path: './config/APIConfig.env'});

const mariadb = require('mariadb');


const server = app.listen(4000);


const pool =
    mariadb.createPool({
        host: process.env.DB_IP,
        port: process.env.DB_PORT,
        user: process.env.DB_User,
        password: process.env.DB_Password,
        database: process.env.DB_Name
})

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get(`/api`, function (request, response){
    response.send('This is version 2.3 of maedns RESTful API');
});

app.get('/api/allUsers', validateAccess ,async (request, response) => {
        try {
                const result = await pool.query("select * from users");
                response.send(result);
        } catch (err) {
                response.sendStatus(500);
        }
})

app.get('/api/user/:id', validateAccess, async (request, response) => {
        let id = request.params.id;
        try {
                const result = await pool.query("select * from users where userid = ?", [id]);
                response.send(result);
        } catch (err) {
                response.sendStatus(500);
        }
})

app.post('/api/createUser', validateAccess, checkUniquenessOfEmail, async (request, response) => {
        let user = request.body

        let hashedPassword = bcrypt.hashSync(user.password, saltRounds)
        try {
                const result = await pool.query("insert into users (username, password, email, firstname, surname) values (?,?,?,?,?)", [user.username, hashedPassword, user.email, user.firstname, user.surname]);
                if (result.warningStatus == 0) return response.status(201).json({username: user.username})
                else response.sendStatus(400)
        } catch (err) {
                response.sendStatus(500);
        }
});

app.delete('/api/deleteUser/:id', validateAccess, async (request,response) => {
        let id = request.params.id;
        try {
                const result = await pool.query("delete from users where userid = ?", [id]);
                response.sendStatus(200)
        } catch (err) {
                response.sendStatus(500);
        }
});

app.put('/api/updateUser' ,validateAccess, checkUniquenessOfEmail, async (request, response) => {
        let user = request.body;

        let hashedPassword = await bcrypt.hash(user.password, saltRounds)
        try {
                const result = await pool.query("update users set username = ?, password = ?, email = ?, firstname = ? , surname = ? where userid = ?",
                    [user.username, hashedPassword, user.email, user.firstname, user.surname, user.id]);
                return response.status(200).json({username: user.username})
        } catch (err) {
                response.sendStatus(500);
        }
});

app.post('/api/loginVerification', validateAccess, async (request,response) => {
        let user = request.body;
        let result = '';
        try {
                result = await pool.query("select * from users where username = ?", [user.username]);
        } catch (err) {
                throw err;
        }
        if (result != ''){
                let answer = result[0]
                bcrypt.compare(user.password, answer.password).then(
                    result => {
                            response.status(200).send({userid: answer.userid})
                    },
                    err => {
                            response.sendStatus(401)
                    }
                );
        }
        else{
                response.sendStatus(403)
        }
});

function validateAccess(request, response, next){
        const authHeader = request.headers["authorization"]
        let token = ''
        try{
                token  = authHeader.split(" ")[1]
        }catch (err) {
                token = null;
        }

        if (token == null){
                return response.status(400).send("Token not present")
        }
        if (token != 'testingStuff') {
                return response.status(403).send("Token invalid")
        }
        else {
                next()
        }
}

async function checkUniquenessOfEmail(request, response, next) {
        try {
                const result = await pool.query("select * from users where email = ?", [request.body.email]);
                if (!result[0]) next()
                else response.status(409).send("Username already used")
        } catch (err) {
                response.sendStatus(500)
        }
}