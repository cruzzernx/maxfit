package com.itb.inf3an.tcc.apimaxfit.exceptions;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
public class ErrorMessage {

 private LocalDateTime timestamp;
 private String[] messages;
 private HttpStatus title;
 private int status;

    public ErrorMessage(LocalDateTime timestamp, String[] messages, HttpStatus title) {
        this.timestamp = timestamp;
        this.messages = messages;
        this.title = title;
        this.status = title.value();
    }
}
