package com.uor.group_14.touripearl_backend.config.webSocket;



import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;

public class MessageHandler extends TextWebSocketHandler implements MessageHandlerInterface {

    @Override
    public void handleTextMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        System.out.println("Message Received: " + message.getPayload());
        session.sendMessage(message); // Echo the same message back
    }
}

