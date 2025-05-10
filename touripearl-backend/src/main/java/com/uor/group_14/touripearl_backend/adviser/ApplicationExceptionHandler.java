package com.uor.group_14.touripearl_backend.adviser;

import com.uor.group_14.touripearl_backend.exception.DuplicateEntryException;
import com.uor.group_14.touripearl_backend.exception.EntryNotFoundException;
import com.uor.group_14.touripearl_backend.exception.InvalidPasswordException;
import com.uor.group_14.touripearl_backend.util.StandardResponseDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.View;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApplicationExceptionHandler {
    private final View error;

    public ApplicationExceptionHandler(View error) {
        this.error = error;
    }

    @ExceptionHandler(EntryNotFoundException.class)
    public ResponseEntity<StandardResponseDto> handleEntryNotFoundException(EntryNotFoundException e) {
        return new ResponseEntity<>(
                new StandardResponseDto(404, e.getMessage(), e),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(DuplicateEntryException.class)
    public ResponseEntity<StandardResponseDto> handleDuplicateEntryException(DuplicateEntryException e) {
        return new ResponseEntity<>(
                new StandardResponseDto(409, e.getMessage(), e),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardResponseDto> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        return new ResponseEntity<>(
                new StandardResponseDto(409, e.getMessage(), e),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardResponseDto> handleValidationExceptions(MethodArgumentNotValidException e) {
        List<String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        return new ResponseEntity<>(
                new StandardResponseDto(400, "Validation failed", errors),
                HttpStatus.NOT_ACCEPTABLE
        );
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<StandardResponseDto> handleIllegalStateException(IllegalStateException e) {
        return new ResponseEntity<>(
                new StandardResponseDto(409, e.getMessage(), e),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<StandardResponseDto> handleInvalidPasswordException(InvalidPasswordException e) {
        return new ResponseEntity<>(
                new StandardResponseDto(401, e.getMessage(), e),
                HttpStatus.UNAUTHORIZED
        );
    }
}
