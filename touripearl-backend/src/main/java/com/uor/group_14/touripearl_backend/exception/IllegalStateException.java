package com.uor.group_14.touripearl_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class IllegalStateException extends RuntimeException {
    public IllegalStateException(String message) {
        super(message);
    }
}
