const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'], 
    },
  });
  
app.use(cors());

const port = new SerialPort( {path:'/dev/ttyACM0', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.on('open', () => {
  console.log('Serial port /dev/ttyACM0 is open.');
});

parser.on('data', (data) => {
  console.log('data: ', data);
  io.emit('accelerometerData', data);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});