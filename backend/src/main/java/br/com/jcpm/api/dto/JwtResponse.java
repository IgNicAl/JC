package br.com.jcpm.api.dto;

import br.com.jcpm.api.domain.enums.UserType;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para a resposta de autenticação, contendo o token JWT e dados do usuário.
 */
@Getter
@Setter
public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private UUID id;
  private String username;
  private String email;
  private String name;
  private UserType userType;

  public JwtResponse(
      String accessToken, UUID id, String username, String email, String name, UserType userType) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.email = email;
    this.name = name;
    this.userType = userType;
  }
}
