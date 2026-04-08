package com.springboot.myapp.exceptions;

public class TicketUpdatePermissionException extends RuntimeException {
    public TicketUpdatePermissionException(String message) {
        super(message);
    }
}
