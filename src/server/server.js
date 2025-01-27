const PORT = process.env.PORT || 8081;

const fs = require('fs');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: PORT });

const getTimeRightNow = () => {
  return new Date().toLocaleTimeString();
}

const saveDataToFile = (msg) => {
  fs.readFile('data/data.json', (err, fileData) => {
    if (err) {
      if (err.code === 'ENOENT') { // file doesn't exist and must be created
        const jsonData = JSON.stringify({ messages: [ msg ] });
        fs.writeFile('data/data.json', jsonData, (err) => {
          if (err) throw err;
          console.log('data added to new file');
        });
      } else {
        console.error('error reading file:', err);
      }
    } else { // file exists
      let jsonObj = JSON.parse(fileData); // get existing contents of file
      jsonObj.messages.push(msg);
      fs.writeFile('data/data.json', JSON.stringify(jsonObj), (err) => {
        if (err) throw err;
        console.log('data appended to existing file');
      });
    }
})
}
 
wss.on('connection', (ws) => {
  console.log('client connected...');

  let prependedTimeNow = `[${getTimeRightNow()}]`;
  let initialMsg = `${prependedTimeNow} Welcome to the WebSocket server!`;
  ws.send(initialMsg);
  saveDataToFile(initialMsg);

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      prependedTimeNow = `[${getTimeRightNow()}] `; // note extra trailing space
      let clientMsg = prependedTimeNow + message.toString().replace(/["]+/g, '');
      client.send(clientMsg);
      saveDataToFile(clientMsg);
    });
  });

  ws.onerror = () => {
    console.log('websocket error');
  };
 
  ws.on('close', () => {
    console.log('client disconnected');
  });
});

console.log(`WebSocket server listening on ws://localhost:${PORT}`);