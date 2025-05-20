package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.entity.enumEntity.EmailTemplate;
import com.uor.group_14.touripearl_backend.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {
    private final JavaMailSender mailSender;

    @Async
    @Override
    public void SendMail(String email, String subject, String body){
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        String template = EmailTemplate.GENERIC_EMAIL.getTemplate(subject,body);
        try {
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(template, true);
            mailSender.send(message);
        }catch (MessagingException e){
            throw new IllegalStateException("Failed to send email", e);
        }
    }

    @Async
    @Override
    public void sendPasswordResetEmail(String email, String token) {
        String body = EmailTemplate.PASSWORD_RESET_EMAIL.getTemplate(token);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(email);
            helper.setSubject("Your Password Reset Token");
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new IllegalStateException("Failed to send password reset email", e);
        }
    }

    @Async
    @Override
    public void sendEmailVerifyToken(String email, String token, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(email);
            helper.setSubject("Please Verify Your Account with Email");
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new IllegalStateException("Failed to send verify email", e);
        }
    }
}
