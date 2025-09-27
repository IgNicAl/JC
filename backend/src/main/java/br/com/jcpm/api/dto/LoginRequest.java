package br.com.jcpm.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para encapsular as credenciais de login.
 */
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

  @NotBlank(message = "Username é obrigatório")
  private String username;

  @NotBlank(message = "Password é obrigatório")
  private String password;

  public LoginRequest(String username, String password) {
    this.username = username;
    this.password = password;
  }
}
