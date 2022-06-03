const dotenv = require('dotenv');
dotenv.config({ path: './config/app.env'});

const cors = require('cors')

const express = require('express');
const bodyParser = require('body-parser');

const mariadb = require('mariadb');

const app = express();

let fs = require('fs');
let util = require('util');
let logFile = fs.createWriteStream('log.txt', {flags: 'w'});
let logStdout = process.stdout;

console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
}

app.use(express.json(), cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//returns current status
app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 4000;

let clients = [];
let games = [];

app.listen(PORT, () => {
    reloadGames().then()
})

//creates a SSE connection to client and stores it at clientObject
function eventsHandler(request, response) {
    //creates stream
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const clientId = request.params.id;

    //store client
    const newClient = {
        id: clientId,
        response
    };
    clients.push(newClient);

    request.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });
}

app.get('/startStream/:id', eventsHandler);


//sending Game data to all players after move is done
async function sendGame(request, response) {
    const gameID = request.body.gameID;
    const data = request.body.msg;
    try{
        //get right gameObject from gameID
        let game = games.filter(games => games.id === gameID)[0]
        if(game !== undefined){
            game = game.clients
            let clientStreams = [];
            //get clientObjects from all clientIds in the game
            for(const client of game){
                clientStreams.push(clients.filter(clients => clients.id === client.toString())[0])
            }
            //send gameData to every client after move is done
            clientStreams.forEach(client => client.response.write(`data: ${JSON.stringify(data)}\n\n`))

            response.sendStatus(200)
        }
        else response.sendStatus(300)
    }catch (err){
        console.log(err)
        response.sendStatus(500)
    }
}

//creates GameObject with game and ClientID
async function createGame(request, response){
    const clientID = request.body.clientID
    const gameID = request.body.gameID
    let newGame = {
        id: gameID,
        clients : [clientID]
    }
    games.push(newGame)
    return  response.json(gameID)
}

//add client to gameObject
async function joinGame(request, response){
    const clientID = request.body.clientID
    const gameID = request.body.gameID
    let game = games.filter(games => games.id === gameID)[0]
    if(game !== undefined){
        game.clients.push(clientID)
        return  response.json(gameID)
    }
    return response.sendStatus(500)
}

//delete GameObject so data is no longer send to clients
async function deleteGame(request, response){
    const gameID = request.params.id
    games = games.filter(game => game.id !== gameID)
    return response.json(gameID)
}

app.post('/createGame', createGame);

app.post('/joinGame', joinGame);

app.post('/sendGame', sendGame);

app.delete('/deleteGame/:id', deleteGame)

//delivers frontend to client
app.use(express.static(process.env.FRONTEND_DIST_PATH));
app.use('/*',(req, res) => {
    res.sendFile('frontend/index.html', { root: __dirname })
});

const pool =
    mariadb.createPool({
        host: process.env.DB_IP,
        port: process.env.DB_PORT,
        user: process.env.DB_User,
        password: process.env.DB_Password,
        database: process.env.DB_Name
    })


/*
Function once executed when program starts
Loads all games stored in DB so they can be played
Adds a level of security if game crashes
 */
async function reloadGames(){
    let result = await pool.query("Select * from mainGame")
    for(let element of result){
        let newGame = {
            id: element.gameID,
            clients : [element.Player1,element.Player2,element.Player3,element.Player4]
        }
        games.push(newGame)
    }
}