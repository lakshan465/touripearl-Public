package com.uor.group_14.touripearl_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY)
public class InvalidPropertyException extends RuntimeException{
    public InvalidPropertyException(String message) {
        super(message);
    }
}
