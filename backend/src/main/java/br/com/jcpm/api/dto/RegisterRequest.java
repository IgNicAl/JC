package br.com.jcpm.api.dto;

import br.com.jcpm.api.domain.enums.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para o registro de um novo usuário.
 */
@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

  @NotBlank(message = "Username é obrigatório")
  @Size(min = 3, max = 20, message = "Username deve ter entre 3 e 20 caracteres")
  private String username;

  @NotBlank(message = "Email é obrigatório")
  @Email(message = "Email deve ser válido")
  private String email;

  @NotBlank(message = "Password é obrigatório")
  @Size(min = 6, message = "Password deve ter no mínimo 6 caracteres")
  private String password;

  @NotBlank(message = "Name é obrigatório")
  private String name;

  private UserType userType = UserType.USER;
  private String biografia;
  private String urlImagemPerfil;
}
