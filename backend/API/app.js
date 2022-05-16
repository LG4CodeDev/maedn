const express = require('express');
const cors = require('cors')
const app = express();

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



app.use(express.json(), cors());
app.use(bodyParser.urlencoded({extended: false}));

/*
Generals
 */


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
        response.send(result[0]);
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
        response.send(result[0]);
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
    if (game['allowedMoves'] !== "null, null, null, null" && game['allowedMoves'] !== ",,," ) return response.status(403).send({msg: "make Move first", "moves": game['allowedMoves'].split(",")})

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

app.get('/api/getMainGame/:gameID', validateAccess, async (request, response) => {
    let id = request.params.gameID;
    try {
        const result = await pool.query("select * from mainGame where gameID = ?", [id]);
        let positions = [result[0]['Position1'].split(","),result[0]['Position2'].split(","),result[0]['Position3'].split(","),result[0]['Position4'].split(",")]
        response.status(200).send({"positions": positions,
            "Player1" : result[0]['Player1'],
            "Player2" : result[0]['Player2'],
            "Player3" : result[0]['Player3'],
            "Player4" : result[0]['Player4'],
            "status" : result[0]['status'],
            "nextPlayer" : result[0]['turn'],
            "allowedMoves" : result[0]['allowedMoves'].split(",")})
    } catch (err) {
        console.log(err)
        return response.sendStatus(500);
    }

})

//creates a Game
app.post('/api/createMainGame', validateAccess,checkIfPlayerAlreadyInGame, async (request, response) => {
    try {
        let result = await CreateGame(response.locals.user['userid'])

        if (result === 400)response.sendStatus(400)
        else if (result === 500) response.sendStatus(500)
        else response.status(200).send({gameID: result, players: 1})

    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }

})

app.put('/api/joinGame', validateAccess, checkIfPlayerAlreadyInGame,async (request, response) => {
    let result;
    try {
        result = await pool.query("select * from mainGame where status = ?", ['notStarted']);
        if (result[0] === undefined) {
            result = await CreateGame(response.locals.user['userid'])

        if (result === 400)response.sendStatus(400)
        else if (result === 500) response.sendStatus(500)
        else response.status(200).send({gameID: result, players: 1})
        } else {
            await joinGame(response, result[0], response.locals.user['userid'])
        }
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }

});

app.put('/api/joinGame/:gameID', validateAccess,checkIfPlayerAlreadyInGame, async (request, response) => {
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
        await axios({method :'delete', url : url})
        response.sendStatus(200);
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
    }
})

/*
Game Logic needed Functions
 */


async function checkIfPlayerAlreadyInGame(request, response, next) {
    let playerID = response.locals.user['userid']
    try {
        let result = await pool.query("Select * from mainGame WHERE (Player1 = ? OR Player2 = ? OR Player3 = ? OR Player4 = ?) AND status != ?", [playerID,playerID,playerID,playerID, "finished"])
        let game = result[0]
        if(game !== undefined){
            if(game['Player1'] === playerID) return response.status(200).send({gameID: game['gameID'], players: "Player1"})
            else if(game['Player2'] === playerID) return response.status(200).send({gameID: game['gameID'], players: "Player2"})
            else if(game['Player3'] === playerID) return response.status(200).send({gameID: game['gameID'], players: "Player3"})
            else return response.status(200).send({gameID: game['gameID'], players: "Player4"})
        }
        else next()
    }catch (err){
        console.log(err)
        return response.status(500).send("Player already in Game")
    }
}

async function joinGame(response, joiningGame, player) {
    try {
        if (joiningGame['Player1'] == null)
        {
            await pool.query("UPDATE mainGame SET Player1 = ? where gameID = ?", [player, joiningGame['gameID']]);
            response.status(200).send({gameID: joiningGame['gameID'], players: 1})
        }
        else if (joiningGame['Player2'] == null)
        {
            await pool.query("UPDATE mainGame SET Player2 = ? where gameID = ?", [player, joiningGame['gameID']]);
            response.status(200).send({gameID: joiningGame['gameID'], players: 2})
        }
        else if (joiningGame['Player3'] == null)
        {
            await pool.query("UPDATE mainGame SET Player3 = ? where gameID = ?", [player, joiningGame['gameID']]);
            response.status(200).send({gameID: joiningGame['gameID'], players: 3})
        }
        else if (joiningGame['Player4'] == null)
        {
            await pool.query("UPDATE mainGame SET Player4 = ? where gameID = ?", [player, joiningGame['gameID']]);
            response.status(200).send({gameID: joiningGame['gameID'], players: 4})
            await pool.query("UPDATE mainGame SET status = 'started' where gameID = ?", [joiningGame['gameID']]);
        }
        await axios({
            method: 'post',
            url: "https://spielehub.server-welt.com/joinGame",
            data: {"gameID": joiningGame['gameID'], "clientID": player}
        })
    }catch (err){
        console.log(err)
        response.sendStatus(500)
    }
}

async function CreateGame(player1) {
    try {
        const result = await pool.query("INSERT INTO mainGame (Player1) VALUES (?)", [player1]);

        console.log(result.warningStatus)

        if (result.warningStatus === 0) {
            let gameID = parseInt(result.insertId.toString())
            await axios({
                method: 'post',
                url: "https://spielehub.server-welt.com/createGame",
                data: {
                    "gameID": gameID,
                    "clientID": player1
                }
            })
            return gameID
        }
        else return 400
    }catch (err){
        console.log(err)
        return 500
    }
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

function getRightAreaOfFigure(currentField, game){
    let newArea;
    //move player to the new Area
    switch (currentField[0]) {
        case "AR":
            newArea = 'BR';
            break;
        case "BR":
            newArea = 'CR';
            break;
        case "CR":
            newArea = 'DR';
            break;
        case "DR":
            newArea = 'AR';
            break;
    }
    //if the figure is in again in his first quarter of the game(did one round)
    //he should move to the finish
    if (game['turn'] === 'Player1' && newArea === 'AR') {
        //if his dice role is little enough he can move to finish
        if (currentField[1] <= 3) newArea = 'AF';
        //else the move is not valid
        else return null

    }
    else if (game['turn'] === 'Player2' && newArea === 'BR')
    {
        if (currentField[1] <= 3) newArea = 'BF';
        else return null
    }
    else if (game['turn'] === 'Player3' && newArea === 'CR')
    {
        if (currentField[1] <= 3) newArea = 'CF';
        else return null
    }
    else if (game['turn'] === 'Player4' && newArea[0] === 'DR')
    {
        if (currentField[1] <= 3) newArea = 'DF';
        else return null
    }

    return newArea
}

function calculateMoves(game, diceResult, playerFields) {
    let listOfMoves = [];
    for (const playerFieldsKey of playerFields) {
        let element = playerFieldsKey.split("_");
        element[1] = parseInt(element[1]);

        //if figure is in start and player did not role 6 no move available for that figure
        if (diceResult !== 6 && element[0][1] === 'S')
        {
            listOfMoves.push(null);
            continue;
        }
        //if figure is in start and player did role 6, the figure can move to his first field
        else if (diceResult === 6 && element[0][1] === 'S')
        {
            element[0] = element[0][0] + 'R'
            element[1] = 0
        }
        //if figure is in finish, check if he can step further in the finish for better position
        else if (element[0][1] === 'F')
        {
            element[1] += diceResult
            if (element[1] > 3)
            {
                listOfMoves.push(null);
                continue;
            }
        }
        //if player is on field check possible moves
        else
        {
            //add dice result to current field
            element[1] += diceResult;
            // if player gets in a new quader of the game check which one
            if (element[1] > 9) {
                element[1] -= 10;
                let tmp = getRightAreaOfFigure(element, game)
                if (tmp !== null) element[0] = tmp
                else{
                    listOfMoves.push(null)
                    continue
                }
            }
        }

        //rejoin split and modified fields
        element = (element[0] + "_" + element[1])
        //check if filed is already occupied by another figure of the player
        //if so move is not available
        if (playerFields.includes(element)) {
            listOfMoves.push(null);
            continue;
        }
        //if move was not declined in process add to list
        listOfMoves.push(element)
    }
    return listOfMoves;
}

function checkRoleAgain(playerFields, diceResult, moves) {
    //If player rolled 6 he always is allowed to role again
    if (diceResult === 6) return true;
    //If player has already 3 roles and no 6 he cant role again
    if (moves + 1 >= 3) return false;
    //If no figure of a player is on the field and figures are either in Start or right place at finish he can role a 2nd or 3rd time
    for (const playerFieldsKey of playerFields) {
        let element = playerFieldsKey.split("_");
        //If figure is in start he potentially can role again
        if (element[0][1] === 'S') {}
        //else check if figure is at the end/right place of finish
        else
        {
            if (element[0][1] === 'F')
            {
                if (element[1] === 3) continue;
                //if figure stand in 3. Finish field check if 4. also is used by a figure
                if (element[1] === 2)
                {
                    playerFields.find(element => {
                        if (element.includes('F_3')){}
                        else return false});
                }
                //if figure stand in 2. Finish field check if 3. and 4. also are used by a figure
                if (element[1] === 1)
                {
                    playerFields.find(element => {
                        if (element.includes('F_3'))
                        {
                            playerFields.find(element =>
                            {
                                if (element.includes('F_2')) {
                                } else return false});
                        }else return false});
                }
            }
            else return false;
        }
    }
    return true;
}

function kickFigures(positions, data){
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
                positions[indexPlayer][indexField] = playerChar + "S_" + indexField.toString()
            }
            indexField++
        }
        indexPlayer++
    }
    return positions
}

async function makeMove(data, game, response) {
    let positions = [game['Position1'].split(","), game['Position2'].split(","), game['Position3'].split(","), game['Position4'].split(",")]
    let moves = game['allowedMoves'].split(",")
    if (moves.includes(data.move.toString())) { //valid move done
        //check if any game peace got beaten and kick those
        positions = kickFigures(positions, data)


        const indexOfCurrentPlayer = game['turn'].slice(-1) - 1

        //make the Move
        let newPlayerPos = setPositions(positions[indexOfCurrentPlayer], moves, data.move.toString())
        positions[indexOfCurrentPlayer] = newPlayerPos

        let CountOfDoneMovesOfPlayer = game['movesOfPerson']
        let nextPlayer;

        //if Player is allowed to role again don´t change anything else set new player and Moves of player = 0
        if (game['roleAgain']) nextPlayer = game['turn']
        else {
            nextPlayer = game['turn'].slice(0, -1) + ((parseInt(game['turn'].slice(-1)) % 4) + 1).toString()
            CountOfDoneMovesOfPlayer = 0
        }

        let status
        const isFinished = Boolean(checkFinished(newPlayerPos));
        if (isFinished) status = "Finished"
        else status = "started"

        try {
            // Send game updates over SSE to all players of game
            let result;
            await axios({
                method: 'post',
                url: "https://spielehub.server-welt.com/sendGame",
                data: {
                    "gameID": game['gameID'],
                    "msg": {
                        "positions": positions,
                        "isFinished": isFinished,
                        "nextPlayer": nextPlayer
                    }
                }
            }).then(function (response){
                result = response
            })

            console.log(result)
            if (result.status === 500 )return response.status(500).send("Error in sending Messages")
            else if (result.status === 300)return response.status(500).send("Game does not exist")
        }catch (err) {
            console.log(err)
        }

        try{
            //Update Game in Database
            await pool.query("UPDATE mainGame SET Position1 = ?, Position2 = ?,Position3 = ?, Position4 = ?, turn = ?, status = ?, movesOfPerson = ?, allowedMoves = ? where gameID = ?"
                , [positions[0].toString(), positions[1].toString(), positions[2].toString(), positions[3].toString(), nextPlayer, status, CountOfDoneMovesOfPlayer, "null, null, null, null", game['gameID']]);

            //Send response to client
            response.status(200).send({
                "positions": positions,
                "isFinished": isFinished,
                "nextPlayer": nextPlayer
            })

        } catch (err) {
            console.log(err)
            response.sendStatus(500)
        }
    }
    else return response.status(400).send('Invalid Move')
}

function setPositions(oldPositionOfPlayer, allowedMoves, DoneMove) {
    let index = 0
    for (const move of allowedMoves) {
        if (DoneMove === move) {
            oldPositionOfPlayer[index] = DoneMove
            return oldPositionOfPlayer
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
        return response.status(401).send("Token not present, missing Authorization or wrong format")
    }
    let result;
    try{
        result = await pool.query("Select * from users where token = ?",[token])
    }catch (err) {
        console.log(err)
        return response.status(500)
    }
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
