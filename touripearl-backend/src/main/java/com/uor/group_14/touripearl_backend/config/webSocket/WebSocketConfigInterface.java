package com.uor.group_14.touripearl_backend.config.webSocket;

import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

public interface WebSocketConfigInterface {
    void registerWebSocketHandlers(WebSocketHandlerRegistry registry);
}

