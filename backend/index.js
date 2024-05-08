import express from "express";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const port = 3000;

const wss = new WebSocketServer({ port: port });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message, isBinary) {
    console.log(message.toString(), isBinary);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});
