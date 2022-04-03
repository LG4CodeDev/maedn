const express = require('express');

const app = express();

const server = app.listen(4000);

const mariadb = require('mariadb');

const pool =
    mariadb.createPool({
        host: "167.235.24.74",
        port: 3307,
        user: "admin",
        password: "MariaDB//Adm",
        database: "maedntest"
})

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// http://localhost:4000/api
app.get(`/api`, function (request, response){
    response.send('This is version 2.0 of maedns RESTful API');
});

app.get('/api/allUsers', validateAccess ,async (request, response) => {
        try {
                const result = await pool.query("select * from users");
                response.send(result);
        } catch (err) {
                throw err;
        }
})

app.get('/api/user/:id', validateAccess, async (request, response) => {
        let id = request.params.id;
        try {
                const result = await pool.query("select * from users where userid = ?", [id]);
                response.send(result);
        } catch (err) {
                throw err;
        }
})

app.post('/api/createUser', validateAccess, checkUsername, async (request, response) => {
        let user = request.body

        let hashedPassword = bcrypt.hashSync(user.password, saltRounds)
        try {
                const result = await pool.query("insert into users (username, password, email, firstname, surname) values (?,?,?,?,?)", [user.username, hashedPassword, user.email, user.firstname, user.surname]);
                if (result.warningStatus == 0) return response.status(201).json({username: user.username})
                else response.sendStatus(400)
        } catch (err) {
                throw err;
        }
});

app.delete('/api/deleteUser/:id', validateAccess, async (request,response) => {
        let id = request.params.id;
        try {
                const result = await pool.query("delete from users where userid = ?", [id]);
                console.log(result);
        } catch (err) {
                throw err;
        }
});

app.put('/api/updateUser' ,validateAccess, checkUsername, async (request, response) => {
        let user = request.body;

        let hashedPassword = await bcrypt.hash(user.password, saltRounds)
        try {
                const result = await pool.query("update users set username = ?, password = ?, email = ?, firstname = ? , surname = ? where userid = ?",
                    [user.username, hashedPassword, user.email, user.firstname, user.surname, user.id]);
                console.log(result);
        } catch (err) {
                throw err;
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
        const token = authHeader.split(" ")[1]

        if (token == null) response.sendStatus(400).send("Token not present")

        if (token != 'testingStuff') {
                response.status(403).send("Token invalid")
        }
        else {
                next()
        }
}

async function checkUsername(request, response, next) {
        try {
                const result = await pool.query("select * from users where username = ?", [request.body.username]);
                if (!result[0]) next()
                else response.status(409).send("Username already used")
        } catch (err) {
                response.sendStatus(500)
        }
}
