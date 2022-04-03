const PORT = process.env.PORT || 5555;

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

let connectionId = 0;
let connections = [];

app.get('/connection', async (req, res) => {
  let disconnect = false;
  let id = ++connectionId;
  
  connections.push({
    id,
    ip: req.headers['x-forwarded-ip'],
    at: new Date(),
  });
  
  req.on('close', () => {
    disconnect = true;
    connections.splice(connections. findIndex(c => c.id === id), 1);
  });
  
  res.setHeader('cache-control', 'no-store');
  res.setHeader('content-type', 'text/event-stream');

  while (!disconnect) {
    res.send(`data: ${connections.length}\n\n`);
    await sleep(1000);
  }
  
  res.end();
});

app.get('/connections', (req, res) => {
  res.json({
    connections,
    totalCount: connections.length,
  });
});

app.listen(PORT);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}