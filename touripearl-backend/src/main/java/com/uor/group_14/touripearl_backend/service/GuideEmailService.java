package com.uor.group_14.touripearl_backend.service;

import com.uor.group_14.touripearl_backend.entity.guideApplication.GuideApplication;

public interface GuideEmailService {
    public void sendMail(GuideApplication guideApplication,String password);
}
