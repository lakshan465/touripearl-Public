package com.uor.group_14.touripearl_backend.config.webSocket;

import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

public interface MessageHandlerInterface {
    void handleTextMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception;
}




