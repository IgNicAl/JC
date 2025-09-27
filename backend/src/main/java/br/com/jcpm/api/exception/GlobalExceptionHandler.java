package br.com.jcpm.api.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Controlador global para tratamento de exceções na aplicação.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Captura erros de validação dos DTOs (ex: @NotBlank, @Email).
   *
   * @param ex A exceção lançada.
   * @return Um mapa de campos com seus respectivos erros e status 400.
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
      MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult()
        .getAllErrors()
        .forEach(
            (error) -> {
              String fieldName = ((FieldError) error).getField();
              String errorMessage = error.getDefaultMessage();
              errors.put(fieldName, errorMessage);
            });
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
  }

  /**
   * Captura erros de violação de integridade do banco de dados (ex: campos únicos).
   *
   * @param ex A exceção lançada.
   * @return Um mapa com uma mensagem de erro genérica e status 409.
   */
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<Map<String, String>> handleDataIntegrityViolationException(
      DataIntegrityViolationException ex) {
    Map<String, String> error = new HashMap<>();
    String mostSpecificCauseMessage = ex.getMostSpecificCause().getMessage();
    if (mostSpecificCauseMessage.contains("Duplicate entry")) {
      if (mostSpecificCauseMessage.toLowerCase().contains("email")) {
        error.put("message", "Este e-mail já está em uso.");
      } else if (mostSpecificCauseMessage.toLowerCase().contains("username")) {
        error.put("message", "Este nome de usuário já está em uso.");
      } else {
        error.put("message", "Já existe um registro com um dos campos informados.");
      }
    } else {
      error.put("message", "Erro de integridade de dados.");
    }
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  /**
   * Captura exceções de negócio personalizadas.
   *
   * @param ex A exceção lançada.
   * @return Um mapa com a mensagem da exceção e status 400.
   */
  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<Map<String, String>> handleIllegalStateException(IllegalStateException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }
}
