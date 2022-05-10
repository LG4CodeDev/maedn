const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: './config/app.env'});


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(express.json(), cors(corsOptions));
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

    response.write("id :" + clientId.toString());

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
    const gameID = request.body.gameID;
    const newFact = request.body.msg;
    let game = games.filter(games => games.id === gameID)[0]
    game = game.clients
    game.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))

    return  response.json(newFact)
}

async function createGame(request, response){
    const clientID = request.body.clientID
    const gameID = request.body.gameID
    const client = clients.filter(client => client.id === clientID.toString())[0]
    let newGame = {
        id: gameID,
        clients : [client]
    }
    games.push(newGame)
    return  response.json(gameID)
}

async function joinGame(request, response){
    const clientID = request.body.clientID
    const gameID = request.body.gameID
    let game = games.filter(games => games.id === gameID)[0]
    let client = clients.filter(clients => clients.id === clientID.toString())[0]
    game.clients.push(client)
    return  response.json(gameID)
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