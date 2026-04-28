package com.springBoot.cozyheven.config;

import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.exception.RoomNotAvailableException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {



    static final String MESSAGE_KEY = "message";


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e) {
        Map<String, Object> map = new HashMap<>();
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> list = bindingResult.getFieldErrors();
        for (FieldError error : list) {
            map.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity
                .status(HttpStatus.EXPECTATION_FAILED)
                .body(map);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e) {
        Map<String, Object> map = new HashMap<>();
        map.put(MESSAGE_KEY, e.getMessage());
        return ResponseEntity
                .status(HttpStatus.EXPECTATION_FAILED)
                .body(map);
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException e) {
        Map<String, Object> map = new HashMap<>();
        map.put(MESSAGE_KEY, e.getMessage());
        return ResponseEntity
                .status(HttpStatus.EXPECTATION_FAILED)
                .body(map);
    }


    @ExceptionHandler(RoomNotAvailableException.class)
    public ResponseEntity<Map<String, Object>> handleRoomNotAvailableException(
            RoomNotAvailableException e) {
        Map<String, Object> map = new HashMap<>();
        map.put(MESSAGE_KEY, e.getMessage());
        return ResponseEntity
                .status(HttpStatus.EXPECTATION_FAILED)
                .body(map);
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException e) {

        Map<String, Object> map = new HashMap<>();
        map.put(MESSAGE_KEY, e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(map);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Map<String, Object>> handleIOException(
            IOException e) {
        Map<String, Object> map = new HashMap<>();
        map.put(MESSAGE_KEY, e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(map);
    }
}