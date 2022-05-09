const express = require('express');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: './config/app.env'});

const app = express();


/app.use(express.static(process.env.FRONTEND_DIST_PATH));
/*app.use((req, res) => {
    res.sendFile(path.join(__dirname, process.env.FRONTEND_DIST_PATH, 'index.html'))
});*/

/*app.listen(process.env.NODE_PORT, () => {
    console.log(`App listening at http://localhost:${process.env.NODE_PORT}`)
});*/

app.listen(4200)

const emitSSE= (res, id, data) =>{
    res.write('id: ' + id + '\n');
    res.write("data: " + data + '\n\n');
    res.flush()
}

let clientList = []

const handleSSE = (req, res) =>{
    const id = (new Date()).toLocaleTimeString();
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('id: ' +id + '\n')
    // Sends a SSE every 3 seconds on a single connection.
    /*setInterval(function() {
        emitSSE(res, id, (new Date()).toLocaleTimeString());
    }, 3000);

    emitSSE(res, id, (new Date()).toLocaleTimeString());*/
}

app.get("/stream", handleSSE)
