/* ToDo´s:
        - create database if not existing
 */

const express = require('express');
const cors = require('cors')
const app = express();

//const path = require('path');

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const axios = require('axios').default;

const dotenv = require('dotenv');
/*
    loads environment variables
 */
dotenv.config({path: './config/APIConfig.env'});

const mariadb = require('mariadb');


app.listen(4000);

/*
    Database object from mariaDb
    needed for query´s to Database
*/
const pool =
    mariadb.createPool({
        host: process.env.DB_IP,
        port: process.env.DB_PORT,
        user: process.env.DB_User,
        password: process.env.DB_Password,
        database: process.env.DB_Name
    })

let corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(express.json(), cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));

/*
Generals
 */

//cross origin allow
app.options('/*', function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post('/*', function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});



app.get(`/api`, function (request, response) {
    response.send('This is version 3.2 of maedns REST API');
});

/*
    Create server Logs
 */
let fs = require('fs');
let util = require('util');
let logFile = fs.createWriteStream('log.txt', {flags: 'w'});
let logStdout = process.stdout;

console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
}

/*
User stuff
 */

/*
    Creates user
    body:   {
                username : Muster, password : 1234, email : 123@123, firstname : null, surname : null, avatarID : 5/null
            }
 */
app.post('/api/createUser', checkUniquenessOfEmail, async (request, response) => {
    let user = request.body
    //hashes Password with salt rounds
    let hashedPassword = bcrypt.hashSync(user.password, saltRounds)
    try {
        const result = await pool.query("insert into users (username, password, email, firstname, surname, avatar) values (?,?,?,?,?,?)", [user.username, hashedPassword, user.email, user.firstname, user.surname, user.avatarID]);
        let id = parseInt(result.insertId.toString());
        await pool.query("INSERT INTO statsMainGame (userid) VALUES (?)", [id]);

        if (result.warningStatus === 0) return response.status(201).json({userid: id, username: user.username})
        else response.sendStatus(400)
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
});


//creates Avatar of blob and returns ID
app.post('/api/createAvatar', async (request, response) => {
    let avatar = request.body
    try {
        const result = await pool.query("SELECT * FROM avatar WHERE image = ?", [avatar.image]);
        if (result.length > 0) {
            return response.status(200).json({avatarID: result[0]['avatarID']})
        }
    } catch (err) {
        console.log(err);
    }

    try {
        const result = await pool.query("insert into avatar (image) values (?)", [avatar.image]);
        if (result.warningStatus === 0) return response.status(201).json({avatarID: result.insertId.toString()})
        else response.sendStatus(400)
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
});


/*
    validates access
    body : {email : 123@123 , password : 123}
 */
app.post('/api/loginVerification', async (request, response) => {
    let user = request.body;
    let result;
    try {
        result = await pool.query("select * from users where email = ?", [user.email]);
    } catch (err) {
        response.send(500)
        console.log(err);
    }
    if (result[0] !== undefined) {
        let answer = result[0]
        //compare hashed password with unhashed password
        try{
            bcrypt.compare(user.password, answer['password']).then(
                () => {}, //on success do nothing
                () => {
                    return response.sendStatus(401)
                }
            );
            let token = bcrypt.hashSync('LoremIpsum12345', 5)
            await pool.query("Update users set token = ? where userid = ?", [token, answer.userid])
            response.status(200).send({userid: answer.userid, "token" : token})
        }catch (err) {
            response.send(500)
            console.log(err);
        }

    } else {
        response.sendStatus(403)
    }
});



//returns a Single user
app.get('/api/user/:id', validateAccess, async (request, response) => {
    let id = request.params.id;
    try {
        const result = await pool.query("select userid, username, image from users LEFT Join avatar ON avatar = avatarID where userid = ?", [id]);
        response.send(result);
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
})

//delete User with id
app.delete('/api/deleteUser/:id', validateAccess, async (request, response) => {
    let id = request.params.id;
    if (id !== response.locals.user['userid']) return response.sendStatus(403)
    try {
        await pool.query("delete from users where userid = ?", [id]);
        response.sendStatus(200)
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
});

/*
    update user
    body:   {
                username : Muster, password : 1234, email : 123@123, firstname : null, surname : null, avatarID : 5/null
            }
 */
app.put('/api/updateUser', validateAccess, checkUniquenessOfEmail, async (request, response) => {
    let user = request.body;
    if (user.id !== response.locals.user['userid']) return response.sendStatus(403)
    let hashedPassword = await bcrypt.hash(user.password, saltRounds)
    try {
        await pool.query("update users set username = ?, password = ?, email = ?, firstname = ? , surname = ?, avatar = ? where userid = ?",
            [user.username, hashedPassword, user.email, user.firstname, user.surname, user.avatarID, user.id]);
        return response.status(200).json({username: user.username})
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
});


//returns Stats of specific player
app.get('/api/getUserStats/:id', validateAccess, async (request, response) => {
    let id = request.params.id;
    try {
        const result = await pool.query("select * from statsMainGame where userid = ?", [id]);
        response.send(result);
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
})


//returns leaderboard
app.get('/api/MainGame/leaderboard', validateAccess, async (request, response)=>{
    try {
        let result = await pool.query("Select username, Level, winningRate, wins, image from users LEFT Join avatar ON avatar = avatarID natural Join statsMainGame Order by Level DESC")
        response.status(200).send({"1.": result[0],"2.": result[1],"3.": result[2],"4.": result[3],"5.": result[4] })
    }catch (err) {
        response.sendStatus(500)
        console.log(err)
    }
})


/*
Game Logic
 */

app.get('/api/getMoves/:gameID', validateAccess, async (request, response) => {
    let id = request.params.gameID;
    let result;
    let listOfMoves;
    let roleAgain;
    try {
        result = await pool.query("select * from mainGame where gameID = ?", [id]);
    } catch (err) {
        console.log(err)
        return response.sendStatus(500);
    }
    const game = result[0];

    if (game === undefined) return response.status(400).send({msg: 'Game does not exists'});

    if (game['status'] === "notStarted") return response.status(400).send({msg: 'Game not started'});

    if (game[game['turn']] !== response.locals.user['userid']) return response.status(403).send("others players turn")
    if (game['allowedMoves'] !== "null, null, null, null" || game['allowedMoves'] !== ",,," ) return response.status(403).send({msg: "make Move first", "moves": game['allowedMoves']})

    try {
        const diceResult = roleDice();

        let playerFields = getPlayerPosition(game);

        playerFields = playerFields.split([","]);

        listOfMoves = calculateMoves(game, diceResult, playerFields);

        roleAgain = Boolean(checkRoleAgain(playerFields, diceResult, game['movesOfPerson']));

        let stringOfMoves = listOfMoves.toString()
        if (!roleAgain && listOfMoves.toString() === [null, null, null, null].toString()) {
            let nextPlayer = game['turn'].slice(0, -1) + ((parseInt(game['turn'].slice(-1)) % 4) + 1).toString()
            let zero = 0
            await pool.query("UPDATE mainGame SET  allowedMoves = ? , roleAgain = ?,turn = ?, movesOfPerson = ? where gameID = ?", [stringOfMoves, roleAgain, nextPlayer, zero, id]);
        } else {
            let DoneMoves = game['movesOfPerson'] + 1
            await pool.query("UPDATE mainGame SET allowedMoves = ? , roleAgain = ?, movesOfPerson = ? where gameID = ?", [stringOfMoves, roleAgain, DoneMoves, id]);
        }

        response.status(200).send({
            move: {dice: diceResult, fields: listOfMoves},
            roleAgain: roleAgain,
            currentPlayer: game['turn']
        })

    } catch (err) {
        response.sendStatus(500)
        console.log(err);
    }
});

//creates a Game
app.post('/api/createMainGame', validateAccess, async (request, response) => {
    try {
        let result = await CreateGame(response.locals.user['userid'])

        if (result === 400) {
            response.sendStatus(400)
        } else response.status(200).send({gameID: result})

    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }

})

app.put('/api/joinGame', validateAccess, async (request, response) => {
    let result;
    try {
        result = await pool.query("select * from mainGame where status = ?", ['notStarted']);
        if (result[0] === undefined) {
            result = await CreateGame(response.locals.user['userid'])

            if (result === 400) {
                response.sendStatus(400)
            } else response.status(200).send({gameID: result, players: 1})
        } else {
            await joinGame(response, result[0], response.locals.user['userid'])
        }
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }

});

app.put('/api/joinGame/:gameID', validateAccess, async (request, response) => {
    let id = request.params.gameID;
    let result;
    try {
        result = await pool.query("select * from mainGame where gameID = ?", [id])
        if (result[0] === undefined) {
            response.status(400).send({msg: "Game does not exist"})
        } else {
            await joinGame(response, result[0], response.locals.user['userid'])
        }

    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
})

app.put('/api/startGame/:gameID', validateAccess, async (request, response) => {
    let id = request.params.gameID;
    try {
        await pool.query("UPDATE mainGame SET status = 'started' where gameID = ?", [id]);
        response.sendStatus(200)
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
});

app.put('/api/makeMove', validateAccess, async (request, response) => {
    let data = request.body;
    let result;
    try {
        result = await pool.query("select * from mainGame where gameID = ?", [data.id]);
        let game = result[0]
        if (game === undefined) {
            response.status(400).send({msg: "Game does not exist"})
        }

        if (game[game['turn']] !== response.locals.user['userid']) return response.sendStatus(403)

        if (game['status'] === "notStarted") return response.status(400).send({msg: 'Game not started'});

        else await makeMove(data, result[0], response)
    } catch (err) {
        response.sendStatus(500)
        console.log(err);
    }

});

app.delete('/api/finishGame/:id', validateAccess, async (request, response) => {
    let id = request.params.id;
    try {
        let result = await pool.query("select * from mainGame where gameID = ?", [id]);
        let game = result[0]
        if (result[0] === undefined) {
            return response.status(400).send({msg: "Game does not exist"})
        }
        if (game['status'] !== 'Finished') return response.status(400).send({"msg": "Not finished jet"})
        let players = [game['Player1'], game['Player2'], game['Player3'], game['Player4']]
        let positions = [game['Position1'].split(","), game['Position2'].split(","), game['Position3'].split(","), game['Position4'].split(",")]
        for (let i = 0; i <= 3; i++) {
            if (checkFinished(positions[i])) {
                await pool.query("UPDATE statsMainGame SET gamesPlayed = gamesPlayed + 1, wins = wins +1, winingRate = wins/gamesPlayed , level = level + 1 where userid = ?", [players[i]])
            } else {
                await pool.query("UPDATE statsMainGame SET gamesPlayed = gamesPlayed + 1, winingRate = wins/gamesPlayed , level = level + 0.3 where userid = ?", [players[i]])
            }

        }
        await pool.query("Delete from mainGame where gameID = ?", [id])
        const url = "http://localhost:4200/deleteGame/" + id
        axios({method :'delete', url : url})
        response.sendStatus(200);
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
})

/*
Game Logic needed Functions
 */


async function joinGame(response, joiningGame, player) {
    if (joiningGame['Player1'] == null) {
        await pool.query("UPDATE mainGame SET Player1 = ? where gameID = ?", [player, joiningGame['gameID']]);
        response.status(200).send({gameID: joiningGame['gameID'], players: 1})
    } else if (joiningGame['Player2'] == null) {
        await pool.query("UPDATE mainGame SET Player2 = ? where gameID = ?", [player, joiningGame['gameID']]);
        response.status(200).send({gameID: joiningGame['gameID'], players: 2})
    } else if (joiningGame['Player3'] == null) {
        await pool.query("UPDATE mainGame SET Player3 = ? where gameID = ?", [player, joiningGame['gameID']]);
        response.status(200).send({gameID: joiningGame['gameID'], players: 3})
    } else if (joiningGame['Player4'] == null) {
        await pool.query("UPDATE mainGame SET Player4 = ? where gameID = ?", [player, joiningGame['gameID']]);
        response.status(200).send({gameID: joiningGame['gameID'], players: 4})
    }
    axios({method :'post', url : "https://spielehub.server-welt.com/joinGame", data : {"gameID" : joiningGame['gameID'], "clientID" : player}})
}

async function CreateGame(player1) {
    const result = await pool.query("INSERT INTO mainGame (Player1) VALUES (?)", [player1]);

    if (result.warningStatus === 0 ){
        let gameID = parseInt(result.insertId.toString())
        axios({
            method :'post',
            url : "https://spielehub.server-welt.com/createGame",
            data : {
                "gameID" : gameID,
                "clientID" : player1
            }
        })
        return gameID
    }
    else return 400
}

function roleDice() {
    return (Math.floor(Math.random() * 6) + 1);
}

function getPlayerPosition(game) {
    switch (game['turn']) {
        case 'Player1':
            return game['Position1'];
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
        if (diceResult !== 6 && element[0][1] === 'S') {
            listOfMoves.push(null);
            continue;
        } else if (diceResult === 6 && element[0][1] === 'S') {
            element[0] = element[0][0] + 'R'
            element[1] = 0
        } else if (element[0][1] === 'F') {
            element[1] += diceResult
            if (element[1] > 3) {
                listOfMoves.push(null);
                continue;
            }
        } else {
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

                if (game['turn'] === 'Player1' && element[0] === 'AR') {
                    if (element[1] <= 3) element[0] = 'AF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                } else if (game['turn'] === 'Player2' && element[0] === 'BR') {
                    if (element[1] <= 3) element[0] = 'BF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                } else if (game['turn'] === 'Player3' && element[0] === 'CR') {
                    if (element[1] <= 3) element[0] = 'CF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                } else if (game['turn'] === 'Player4' && element[0] === 'DR') {
                    if (element[1] <= 3) element[0] = 'DF';
                    else {
                        listOfMoves.push(null);
                        continue;
                    }
                }
            }
        }
        element = (element[0] + " " + element[1])
        if (playerFields.includes(element)) {
            listOfMoves.push(null);
            continue;
        }
        listOfMoves.push(element)

    }
    return listOfMoves;

}

function checkRoleAgain(playerFields, diceResult, moves) {
    if (diceResult === 6) return true;
    if (moves + 1 >= 3) return false;
    for (const playerFieldsKey of playerFields) {
        let element = playerFieldsKey.split(" ");
        if (element[0][1] === 'S') {
        } else {
            try {
                if (element[0][1] === 'F') {
                    if (element[1] === 3) continue;
                    if (element[1] === 2) {
                        playerFields.find(element => {
                            if (element.includes('F 3')) {
                            } else return false;
                        });
                    }
                    if (element[1] === 1) {
                        playerFields.find(element => {
                            if (element.includes('F 3')) {
                                playerFields.find(element => {
                                    if (element.includes('F 2')) {
                                    } else return false
                                });
                            } else return false
                        });
                    }
                } else return false;
            } catch (err) {
                console.log(err)
                return false;
            }
        }
    }
    return true;
}

async function makeMove(data, game, response) {
    let positions = [game['Position1'].split(","), game['Position2'].split(","), game['Position3'].split(","), game['Position4'].split(",")]
    let moves = game['allowedMoves'].split(",")
    if (moves.includes(data.move.toString())) { //valid move done
        //check if any game peace got beaten
        let indexPlayer = 0
        for (const playerPosition of positions) {
            let indexField = 0
            for (let field of playerPosition) {
                if (field === data.move.toString()) {
                    let playerChar;
                    switch (indexPlayer) {
                        case 0:
                            playerChar = "A"
                            break;
                        case 1:
                            playerChar = "B"
                            break;
                        case 2:
                            playerChar = "C"
                            break;
                        case 3:
                            playerChar = "D"
                            break;
                    }
                    positions[indexPlayer][indexField] = playerChar + "S " + indexField.toString()
                }
                indexField++
            }
            indexPlayer++
        }
        const indexOfCurrentPlayer = game['turn'].slice(-1) - 1
        let newPlayerPos = setPositions(positions[indexOfCurrentPlayer], moves, data.move.toString())
        positions[indexOfCurrentPlayer] = newPlayerPos

        let doneMoves = game['movesOfPerson']
        let nextPlayer;
        if (game['roleAgain']) nextPlayer = game['turn']
        else {
            nextPlayer = game['turn'].slice(0, -1) + ((parseInt(game['turn'].slice(-1)) % 4) + 1).toString()
            doneMoves = 0
        }
        const isFinished = Boolean(checkFinished(newPlayerPos));

        let status

        if (isFinished) status = "Finished"
        else status = "started"

        try {
            await pool.query("UPDATE mainGame SET Position1 = ?, Position2 = ?,Position3 = ?, Position4 = ?, turn = ?, status = ?, movesOfPerson = ?, allowedMoves = ? where gameID = ?"
                , [positions[0].toString(), positions[1].toString(), positions[2].toString(), positions[3].toString(), nextPlayer, status, doneMoves, "null, null, null, null", game['gameID']]);
            response.status(200).send({
                "positions": positions,
                "isFinished": isFinished,
                "nextPlayer": nextPlayer
            })
            axios({
                method :'post',
                url : "https://spielehub.server-welt.com/sendGame",
                data : {
                    "gameID" : game['gameID'],
                    "msg" : {
                        "positions": positions,
                        "isFinished": isFinished,
                        "nextPlayer": nextPlayer
                    }
                }
            })
        } catch (e) {
            response.sendStatus(500)
        }
    } else return response.status(400).send('Invalid Move')
}

function setPositions(oldPos, allowedMoves, move) {
    let index = 0
    for (const e of allowedMoves) {
        if (move === e) {
            oldPos[index] = move
            return oldPos
        }
        index++
    }
}

function checkFinished(positions) {
    for (const position of positions) {
        if (position[1] !== "F") return false
    }
    return true;
}

async function validateAccess(request, response, next){
    const authHeader = request.headers["authorization"]
    let token;
    try {
        token = authHeader.split(" ")[1]
    } catch (err) {
        token = null;
    }

    if (token == null) {
        return response.status(400).send("Token not present")
    }
    let result = await pool.query("Select * from users where token = ?",[token])
    if (result[0] === undefined) {
        return response.status(403).send("Token invalid")
    } else {
        response.locals.user = result[0]
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
