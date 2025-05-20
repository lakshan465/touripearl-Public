package com.uor.group_14.touripearl_backend.entity.enumEntity;

public enum EmailTemplate {
    //args subject,body
    GENERIC_EMAIL("<html><body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;\">" +
            "<div style=\"max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\">" +
            "<h1 style=\"color: #333333; text-align: center;\">Touripearl</h1>" +
            "<h2 style=\"color: #444444;\">%s</h2>" +
            "<p style=\"color: #555555; line-height: 1.6;\">%s</p>" +
            "</div></body></html>"),
    //args token
    PASSWORD_RESET_EMAIL("<html><body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;\">" +
            "<div style=\"max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\">" +
            "<h1 style=\"color: #333333; text-align: center;\">Password Reset Request</h1>" +
            "<p style=\"color: #555555; line-height: 1.6;\">We received a request to reset your password.</p>" +
            "<p style=\"color: #555555; line-height: 1.6;\">Use the following token to reset your password:</p>" +
            "<h2 style=\"color: #007bff; text-align: center;\">%s</h2>" +
            "<p style=\"color: #888888; margin-top: 20px;\">If you did not request a password reset, please ignore this email.</p>" +
            "</div></body></html>"),
    EMAIL_VERIFY_EMAIL("<html><body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;\">" +
            "<div style=\"max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\">" +
            "<h1 style=\"color: #333333; text-align: center;\">Email Verification Request</h1>" +
            "<p style=\"color: #555555; line-height: 1.6;\">Hello,Welcome to TouriPearl</p>" +
            "<p style=\"color: #555555; line-height: 1.6;\">Use the following token to Verify your account:</p>" +
            "<h2 style=\"color: #007bff; text-align: center;\">%s</h2>" +
            "<p style=\"color: #888888; margin-top: 20px;\">Enjoy</p>" +
            "</div></body></html>"),
    ACCOUNT_DELETE_VERIFY("<html>" +
            "<body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;\">\n" +
            "    <div style=\"max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\">\n" +
            "        <h1 style=\"color: #333333; text-align: center;\">Account Deletion Verification</h1>\n" +
            "        <p style=\"color: #555555; line-height: 1.6;\">Hello,</p>\n" +
            "        <p style=\"color: #555555; line-height: 1.6;\">We received a request to delete your TouriPearl account. To confirm this action, please use the following verification code:</p>\n" +
            "        <h2 style=\"color: #dc3545; text-align: center;\">%s</h2>\n" +
            "        <p style=\"color: #555555; line-height: 1.6;\">If you did not request to delete your account, please ignore this email or contact our support team immediately.</p>\n" +
            "        <p style=\"color: #888888; margin-top: 20px;\">Thank you for using TouriPearl</p>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>"),
    ACCOUNT_DELETE_CONFIRM(
            "<html>" +
                    "<body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;\">\n" +
                    "    <div style=\"max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\">\n" +
                    "        <h1 style=\"color: #333333; text-align: center;\">Account Deleted Successfully</h1>\n" +
                    "        <p style=\"color: #555555; line-height: 1.6;\">Hello,</p>\n" +
                    "        <p style=\"color: #555555; line-height: 1.6;\">Your TouriPearl account has been successfully deleted. All your personal data has been removed from our system.</p>\n" +
                    "        <div style=\"background-color: #f8f9fa; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;\">\n" +
                    "            <p style=\"color: #555555; line-height: 1.6; margin: 0;\">If you didn't request this deletion, please contact our support team immediately.</p>\n" +
                    "        </div>\n" +
                    "        <p style=\"color: #555555; line-height: 1.6;\">We're sorry to see you go. If you change your mind, you're always welcome to create a new account.</p>\n" +
                    "        <p style=\"color: #888888; margin-top: 20px; text-align: center;\">Thank you for being part of TouriPearl</p>\n" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>"
    );

    private final String template;

    EmailTemplate(String template) {
        this.template = template;
    }

    public String getTemplate(Object... args) {
        return String.format(template, args);
    }
}
