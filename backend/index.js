import express from "express";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const port = 3000;

const wss = new WebSocketServer({ port: port });
let nextClientId = 1; // Track the next available client ID
const clients = new Map(); // Map to store client connections

wss.on("connection", function connection(ws) {
  const clientId = nextClientId++; // Assign client ID
  clients.set(clientId, ws); // Store client connection in the map

  // Send the client its assigned ID
  ws.send(JSON.stringify({ type: "client-id", clientId }));

  ws.on("message", function incoming(message) {
    try {
      const data = JSON.parse(message);
      console.log("Received message data:", data);

      // Parse recipientId as a number
      const recipientId = parseInt(data.recipientId);

      if (isNaN(recipientId)) {
        console.error("Invalid recipient ID:", data.recipientId);
        return;
      }

      console.log("Recipient ID:", recipientId);

      const recipientSocket = clients.get(recipientId);
      console.log("Recipient socket:", recipientSocket);

      if (recipientSocket) {
        console.log("Sending message to recipient:", recipientId);
        recipientSocket.send(
          JSON.stringify({ senderId: clientId, text: data.text })
        );
      } else {
        console.log("Recipient not found:", recipientId);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    clients.delete(clientId); // Remove client from map when connection closes
  });
});
