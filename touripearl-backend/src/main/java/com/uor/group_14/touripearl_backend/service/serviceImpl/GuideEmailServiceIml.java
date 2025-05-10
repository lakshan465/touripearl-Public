package com.uor.group_14.touripearl_backend.service.serviceImpl;

import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;
import com.uor.group_14.touripearl_backend.service.EmailService;
import com.uor.group_14.touripearl_backend.service.GuideEmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GuideEmailServiceIml implements GuideEmailService {

    private final EmailService mail; // Use 'final' for clarity
    private final PasswordEncoder passwordEncoder;

    public void sendMail(GuideApplication guideApplication,String password) {
        String to= guideApplication.getEmail();
        String subject="Congratulations! Your Guide Application Has Been Approved";
        String body = "Dear " + guideApplication.getFirstname() + " " + guideApplication.getLastname() + ",\n\n"
                + "We are delighted to inform you that your guide application with ID " + guideApplication.getGuideApplicationId()
                + " has been approved. Welcome aboard!\n\n"
                + "Here are your login credentials to access your account:\n"
                + "- **Username:** " + guideApplication.getEmail() + "\n"
                + "- **Password:** " + password + "\n\n"
                + "For security reasons, we recommend changing your password immediately after logging in.\n\n"
                + "If you have any questions or need assistance, feel free to contact our support team.\n\n"
                + "Best regards,\n"
                + "The TouriPearl Team\n"
                + "Email: support@touripearl.com\n"
                + "Phone: +1-800-123-4567\n"
                + "Website: www.touripearl.com\n";
        mail.sendEmail(to, subject, body);
        System.out.println(to);
        System.out.println("mail.sendEmail");
    }
}

