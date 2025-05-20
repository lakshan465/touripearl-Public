package com.uor.group_14.touripearl_backend.service;

import jakarta.mail.MessagingException;

public interface MailService {
    void SendMail(String email, String subject, String body) throws MessagingException;
    void sendPasswordResetEmail(String email, String token);
    void sendEmailVerifyToken(String email, String token, String body);
}
