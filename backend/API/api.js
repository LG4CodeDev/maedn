/* ToDo´s:
        - create database if not existing
 */

const express = require('express');

const app = express();

const path = require('path');

const dotenv = require('dotenv');

dotenv.config({path: './config/APIConfig.env'});

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
app.use(bodyParser.urlencoded({extended: false}));

/*
Generals
 */

app.options('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post('/*', async (request, response, next) => {
   response.header("Access-Control-Allow-Origin","*");
   response.header("Access-Control-Allow-Headers","Content-Type");
   next();
});


app.options('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


app.post('/*', async (request, response, next) => {
   response.header("Access-Control-Allow-Origin","*");
   response.header("Access-Control-Allow-Headers","Content-Type");
   next();
});



app.get(`/api`, function (request, response) {
    response.send('This is version 2.3 of maedns RESTful API');
});

/*
User stuff
 */

app.get('/api/allUsers', validateAccess, async (request, response) => {
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
                const result = await pool.query("insert into users (username, password, email, firstname, surname, avatar) values (?,?,?,?,?,?)", [user.username, hashedPassword, user.email, user.firstname, user.surname, user.avatarID]);
                let id = parseInt(result.insertId.toString());
                const answer = await  pool.query("INSERT INTO statsMainGame (userid) VALUES (?)" , [id]);

                if (result.warningStatus == 0) return response.status(201).json({userid: id,username: user.username})
                else response.sendStatus(400)
        } catch (err) {
                response.sendStatus(500);
        }
});

app.post('/api/createAvatar', validateAccess, async (request, response) => {
        let avatar = request.body
        try{
                const result = await pool.query("SELECT * FROM avatar WHERE image = ?", [avatar.image]);
                if (result.length > 0){
                        return response.status(200).json({avatarID : result[0]['avatarID']})
                }
        }catch{
        }

        try {
                const result = await pool.query("insert into avatar (image) values (?)", [avatar.image]);
                if (result.warningStatus == 0) return response.status(201).json({avatarID : result.insertId.toString()})
                else response.sendStatus(400)
        } catch (err) {
                throw (err);
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

app.put('/api/updateUser', validateAccess, checkUniquenessOfEmail, async (request, response) => {
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

app.post('/api/loginVerification', validateAccess, async (request, response) => {
    let user = request.body;
    let result = '';
    try {
        result = await pool.query("select * from users where username = ?", [user.username]);
    } catch (err) {
        throw err;
    }
    if (result != '') {
        let answer = result[0]
        bcrypt.compare(user.password, answer.password).then(
            result => {
                response.status(200).send({userid: answer.userid})
            },
            err => {
                response.sendStatus(401)
            }
        );
    } else {
        response.sendStatus(403)
    }
});

/*
Game Logic
 */

app.get('/api/getMoves/:gameID', validateAccess, async (request, response) => {
    let id = request.params.gameID;
    let result;
    let listOfMoves;
    let roleAgain;
    try {
        result = await pool.query("select * from mainGame where gameid = ?", [id]);
    } catch (err) {
        console.log(err)
        return response.sendStatus(500);
    }
    const game = result[0];

    if(game == undefined) return response.status(400).send({msg: 'Game existiert nicht'});

    try{
        const diceResult = roleDice();

        let playerFields = getPlayerPosition(game);

        playerFields = playerFields.split([","]);

        listOfMoves = calculateMoves(game, diceResult, playerFields);

        roleAgain = Boolean(checkRoleAgain(playerFields, diceResult, game['movesOfPerson']));

        if (!roleAgain && listOfMoves === [null,null,null,null]){
            await pool.query("UPDATE mainGame SET turn = ?, movesOfPerson = ? where gameid = ?", [game['turn'].slice(0, -1) + ((parseInt(game['turn'].slice(-1)) % 4) + 1).toString(),0, id]);
        }

        response.status(200).send({move : {dice : diceResult, fields : listOfMoves, roleAgain : roleAgain}})




    }
    catch (err){
        response.sendStatus(500)
    }
    try {

        let stringOfMoves = listOfMoves.toString()
        let DoneMoves = game['movesOfPerson'] + 1
        let msg = await pool.query("UPDATE mainGame SET allowedMoves = ? , roleAgain = ?, movesOfPerson = ? where gameid = ?", [stringOfMoves, roleAgain,DoneMoves, id]);
    }catch (err){}
})

app.post('/api/createMainGame', validateAccess, async (request, response) =>{
    let data = request.body

    try {
        result = await CreateGame(data.player1)

        if (result == 400){
            response.sendStatus(400)
        }
        else response.status(200).send({gameID: result})

    }catch (err){
        response.sendStatus(500)
    }

})

app.put('/api/joinGame', validateAccess, async (request, response) => {
    let data = request.body
    let result;
    try {
        result = await pool.query("select * from mainGame where status = ?", ['notStarted']);
        if(result[0] == undefined){
            result = await CreateGame(data.player)

            if (result == 400){
                response.sendStatus(400)
            }
            else response.status(200).send({gameID: result, players : 1})
        }
        else{
            joinGame(response, result[0], data.player)
        }
    } catch (err) {
        return response.sendStatus(500);
    }

})

app.put('/api/joinGame/:gameID', validateAccess, async (request, response) => {
    let id = request.params.gameID;
    let data = request.body
    let result;
    try {
        result = await pool.query("select * from mainGame where gameid = ?", [id])
        if(result[0] == undefined){
            response.status(400).send({msg: "Game does not exist"})
        }
        else{
            joinGame(response, result[0], data.player)
        }

    }catch (err){
        response.sendStatus(500)
    }
})

app.put('/api/startGame/:gameID', validateAccess, async (request, response) => {
    let id = request.params.gameID;
    try {
        await pool.query("UPDATE mainGame SET status = 'started' where gameid = ?", [id]);
        response.sendStatus(200)
    }catch (err){
        response.sendStatus(500)
    }
});

app.put('/api/makeMove', validateAccess, async (request, response) => {
    let data = request.body;
    let result;
    try {
        result = await pool.query("select * from mainGame where gameid = ?", [data.id]);
        if(result[0] == undefined){
            response.status(400).send({msg: "Game does not exist"})
        }
        else await makeMove(data, result[0], response)
    }catch (err){
        console.log(err)
        response.sendStatus(500)
    }

});

async function joinGame(response, joiningGame, player){
    if(joiningGame['Player1'] == null){
        await pool.query("UPDATE mainGame SET Player1 = ? where gameid = ?", [player, joiningGame['gameid']]);
        response.status(200).send({gameid : joiningGame['gameid'] , players : 1})
    }
    else if(joiningGame['Player2'] == null){
        await pool.query("UPDATE mainGame SET Player2 = ? where gameid = ?", [player, joiningGame['gameid']]);
        response.status(200).send({gameid : joiningGame['gameid'] , players : 2})
    }
    else if(joiningGame['Player3'] == null){
        await pool.query("UPDATE mainGame SET Player3 = ? where gameid = ?", [player, joiningGame['gameid']]);
        response.status(200).send({gameid : joiningGame['gameid'] , players : 3})
    }
    else if(joiningGame['Player4'] == null) {
        await pool.query("UPDATE mainGame SET Player4 = ? where gameid = ?", [player, joiningGame['gameid']]);
        response.status(200).send({gameid: joiningGame['gameid'], players: 4})
    }
}

async function CreateGame(player1) {

    const result = await pool.query("INSERT INTO mainGame (Player1) VALUES (?)", [player1]);
    if (result.warningStatus == 0){
        return parseInt(result.insertId.toString())
    }
    else return 400
}

function roleDice(){
    return (Math.floor(Math.random() * 6)+1);
}

function getPlayerPosition(game){
    switch (game['turn']) {
        case 'Player1':
            return  game['Position1'];
        case 'Player2':
            return game['Position2'];
        case 'Player3':
            return game['Position3'];
        case 'Player4':
            return game['Position4'];
    }
}

function calculateMoves(game, diceResult, playerFields) {
    let listOfMoves = [];
    for (const playerFieldsKey of playerFields) {
        let element = playerFieldsKey.split(" ");
        element[1] = parseInt(element[1]);
        if (diceResult != 6 && element[0][1] == 'S'){
            listOfMoves.push(null);
            continue;
        }
        else if (diceResult == 6 && element[0][1] == 'S'){
            element[0] = element[0][0] + 'R'
            element[1] = 1
        }
        else if (element[0][1] == 'F'){
            element[1] += diceResult
            if(element[1] > 3){
                listOfMoves.push(null);
                continue;
            }
        }
        else {
            element[1] += diceResult;
            if (element[1] > 9) {
                element[1] -= 10;
                switch (element[0]) {
                    case "AR":
                        element[0] = 'BR';
                        break;
                    case "BR":
                        element[0] = 'CR';
                        break;
                    case "CR":
                        element[0] = 'DR';
                        break;
                    case "DR":
                        element[0] = 'AR';
                        break;
                }

                if (game['turn'] == 'Player1' && element[0] == 'A') {
                    if (element[1] <= 3) element[0] = 'AF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                } else if (game['turn'] == 'Player2' && element[0] == 'B') {
                    if (element[1] <= 3) element[0] = 'BF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                } else if (game['turn'] == 'Player3' && element[0] == 'C') {
                    if (element[1] <= 3) element[0] = 'CF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                } else if (game['turn'] == 'Player4' && element[0] == 'D') {
                    if (element[1] <= 3) element[0] = 'DF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                }
            }
        }
        element = (element[0]+ " " + element[1])
        if(playerFields.includes(element)){
            listOfMoves.push(null);
            continue;
        }
        listOfMoves.push(element)

    }
    return listOfMoves;

}

function checkRoleAgain(playerFields, diceResult, moves){
        if (diceResult == 6) return true;
        if (moves >= 3) return false;
        for (const playerFieldsKey of playerFields) {
                let element = playerFieldsKey.split(" ");
                if(element[0][1] == 'S'){
                        continue;
                }
                else{
                        try{
                                if(element[0][1] == 'F'){
                                        if(element[1] == 3) continue;
                                        if (element[1] == 2){
                                                playerFields.find(element => {
                                                        if (element.includes('F 3')) {
                                                        }
                                                        else return false;
                                                });
                                        }
                                        if (element[1] == 1){
                                                playerFields.find(element => {
                                                        if (element.includes('F 3')) {
                                                                playerFields.find(element => {
                                                                        if (element.includes('F 2')) {}
                                                                        else return false
                                                                });
                                                        }
                                                        else return false
                                                });
                                        }
                                }
                                else return false;

                        }catch (err){
                                return false;
                        }

                }
        }
        return true;
}

async function makeMove(data, game, response){
    let positions = [game['Position1'].split(","), game['Position2'].split(","), game['Position3'].split(","), game['Position4'].split(",")]
    let moves = game['allowedMoves'].split(",")
    if(moves.includes(data.move.toString())){ //valid move done
        //check if any game peace got beaten
        let indexPlayer = 0
        for (const playerPosition of positions) {
            let indexField = 0
            for (let field of playerPosition) {
                if(field == data.move.toString()){
                    positions[indexPlayer][indexField] = field[0] + "S " + indexField.toString()
                }
                indexField++
            }
            indexPlayer++
        }
        const indexOfCurrentPlayer = game['turn'].slice(-1) - 1
        let newPlayerPos = setPostiotins(positions[indexOfCurrentPlayer], moves, data.move.toString())
        positions[indexOfCurrentPlayer] = newPlayerPos

        let doneMoves = game['movesOfPerson']
        let nextplayer;
        if (game['roleAgain'] == 1) nextplayer = game['turn']
        else {
            nextplayer = game['turn'].slice(0, -1) + ((parseInt(game['turn'].slice(-1)) % 4) + 1).toString()
            doneMoves = 0
        }
        const isFinished = Boolean(checkFinished(newPlayerPos));

        let status

        if(isFinished) status = "Finished"
        else status = "started"

        try {
            let result = await pool.query("UPDATE mainGame SET Position1 = ?, Position2 = ?,Position3 = ?, Position4 = ?, turn = ?, status = ?, movesOfPerson = ? where gameid = ?"
                , [positions[0].toString(), positions[1].toString(), positions[2].toString(), positions[3].toString(), nextplayer, status, doneMoves, game['gameid']]);
            response.sendStatus(200)
        }catch (e){
            console.log(e)
            response.sendStatus(500)
        }
    }
    else return response.status(400).send('Invalid Move')
}

function setPostiotins(oldPos, allowedMoves, move){
    let index = 0
    for (const e of allowedMoves) {
        if (move == e){
            oldPos[index] = move
            return oldPos
        }
    index++
    }
}

function checkFinished(positions){
    for (const position of positions) {
        if(positions[1] != "F") return false
    }
    return true;
}

function validateAccess(request, response, next) {
    const authHeader = request.headers["authorization"]
    let token = ''
    try {
        token = authHeader.split(" ")[1]
    } catch (err) {
        token = null;
    }

    if (token == null) {
        return response.status(400).send("Token not present")
    }
    if (token != 'testingStuff') {
        return response.status(403).send("Token invalid")
    } else {
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
