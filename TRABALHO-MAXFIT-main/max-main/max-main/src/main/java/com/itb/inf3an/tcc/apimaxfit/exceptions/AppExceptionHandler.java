package com.itb.inf3an.tcc.apimaxfit.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class AppExceptionHandler {

    private static final ZoneId ZONE_BRASIL = ZoneId.of("America/Sao_Paulo");
    private static final Map<Class<? extends Exception>, HttpStatus> EXCEPTION_STATUS_MAP = new HashMap<>();

    static  {
        EXCEPTION_STATUS_MAP.put(BadRequest.class, HttpStatus.BAD_REQUEST);
        EXCEPTION_STATUS_MAP.put(NotFound.class, HttpStatus.NOT_FOUND);
        EXCEPTION_STATUS_MAP.put(Unauthorized.class, HttpStatus.UNAUTHORIZED);
        EXCEPTION_STATUS_MAP.put(Forbidden.class, HttpStatus.FORBIDDEN);
        EXCEPTION_STATUS_MAP.put(AccessDeniedException.class, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllException(Exception ex, HttpServletRequest request){
        // Define o status
        HttpStatus status = EXCEPTION_STATUS_MAP.getOrDefault(ex.getClass(), HttpStatus.INTERNAL_SERVER_ERROR);
        // Define a mensagem
        String message = (ex instanceof Forbidden || ex instanceof AccessDeniedException)
                ? "Você não tem permissão para acessar este recurso."
                : (ex.getLocalizedMessage() != null ? ex.getLocalizedMessage() : ex.toString());
        // Cria ErrorMessage
        LocalDateTime now = LocalDateTime.now(ZONE_BRASIL);
        String[] messages = message.split(":");
        ErrorMessage errorMessage = new ErrorMessage(now, messages, status);

        return new ResponseEntity<>(errorMessage, new HttpHeaders(), status);
    }
}
