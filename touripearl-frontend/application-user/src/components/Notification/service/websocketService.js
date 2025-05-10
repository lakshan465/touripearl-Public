import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "global";


let stompClients = []; // Store all clients in array

export const createWebSocketClient = () => {
  const client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8085/ws"),
    reconnectDelay: 5000,
    onConnect: () => console.log("Connected to WebSocket"),
    onDisconnect: () => console.log("Disconnected from WebSocket"),
  });
  stompClients.push(client); // Add client to array
  return client;
};


export const connectWebSocket = (onMessageReceived) => {
  const stompClient = createWebSocketClient();

  // Delay the activation by 1 second (1000 milliseconds)
  setTimeout(() => {
    stompClient.activate();
    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");
      stompClient.subscribe(`/topic/notifications/toAllGuide`, (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data.message);
      });
    };
  }, 3000); // 1000 milliseconds delay
};


export const connectWebSocket2 = (touristId, onMessageReceived) => {
  const stompClient = createWebSocketClient();
  stompClient.activate();
  stompClient.onConnect = () => {
    console.log("Connected to WebSocket");
    stompClient.subscribe(`/topic/notifications/${touristId}`, (message) => {
      const data = JSON.parse(message.body);
      onMessageReceived(data.message);
    });
  };
};

export const connectWebSocket3 = (guideUUID, onMessageReceived) => {
  const stompClient = createWebSocketClient();
  stompClient.activate();
  stompClient.onConnect = () => {
    console.log("Connected to WebSocket");
    stompClient.subscribe(`/topic/notifications/${guideUUID}`, (message) => {
      const data = JSON.parse(message.body);
      onMessageReceived(data.message);
    });
  };
};

export const disconnectWebSocket = () => {
  stompClients.forEach((client) => {
    if (client.connected) {
      console.log("WebSocket Disconnected 🔌");
      client.deactivate();
    }
  });
  stompClients = []; // Reset array after disconnect
};

