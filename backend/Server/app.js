const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: './config/app.env'});


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const e = require("express");

const app = express();


/*
let fs = require('fs');
let util = require('util');
let logFile = fs.createWriteStream('log.txt', {flags: 'w'});
let logStdout = process.stdout;

console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
}*/

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 4000;

let clients = [];
let games = [];
let facts = [];

app.listen(PORT)

function eventsHandler(request, response) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(facts)}\n\n`;

    response.write(data);

    const clientId = request.params.id;

    response.write("id :" + clientId.toString() + "\n");

    const newClient = {
        id: clientId,
        response
    };

    clients.push(newClient);

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
}

app.get('/startStream/:id', eventsHandler);



async function sendGame(request, response) {
    try{
        const gameID = request.body.gameID;
        const data = request.body.msg;
        let game = games.filter(games => games.id === gameID)[0]
        console.log(game)
        if(game !== undefined){
            game = game.clients
            let clientStreams = [];
            for(const client of game){
                clientStreams.push(clients.filter(clients => clients.id === client.toString())[0])
            }

            console.log(clientStreams)

            let body = JSON.stringify(data)

            clientStreams.forEach(client => client.response.write(`data: ${JSON.stringify(data)}\n\n`))


            response.sendStatus(200)
        }
        else response.sendStatus(300)
    }catch (err){
        console.log(err)
        response.sendStatus(500)
    }

}

async function createGame(request, response){
    console.log("Hello World")
    const clientID = request.body.clientID
    const gameID = request.body.gameID
    let newGame = {
        id: gameID,
        clients : [clientID]
    }
    games.push(newGame)
    console.log(games)
    return  response.json(gameID)
}

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

async function deleteGame(request, response){
    const gameID = request.params.id
    games = games.filter(game => game.id !== gameID)
    return response.json(gameID)
}

app.post('/createGame', createGame);

app.post('/joinGame', joinGame);

app.post('/sendGame', sendGame);

app.delete('/deleteGame/:id', deleteGame)


app.use(express.static(process.env.FRONTEND_DIST_PATH));
app.use('/*',(req, res) => {
    res.sendFile('frontend/index.html', { root: __dirname })
});