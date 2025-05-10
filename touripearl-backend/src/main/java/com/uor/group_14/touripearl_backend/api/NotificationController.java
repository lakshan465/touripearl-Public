package com.uor.group_14.touripearl_backend.api;


import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Controller
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;

//    public NotificationController(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }

    @MessageMapping("/notify")
    @SendTo("/topic/notifications")
    public String sendNotification(String message) {
        return message;
    }

    public void sendTourAcceptedNotification(String touristId, String message) {
        try {
            // Introduce a delay of 3 seconds (3000 milliseconds)
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace(); // Handle exception if interrupted
        }
        Map<String, String> notification = new HashMap<>();
        notification.put("message", message);

        messagingTemplate.convertAndSend("/topic/notifications/" + touristId, notification);
    }

}
