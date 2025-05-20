package com.uor.group_14.touripearl_backend.util;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ImageUploadGenerator {

    public String generateTouriPearlResourceName(String name, String type) {
        StringBuilder builder = new StringBuilder();
        builder.append(UUID.randomUUID().toString());
        builder.append("-TP-");
        builder.append(type).append("-");
        builder.append(name);
        return builder.toString();
    }

}
