package br.com.jcpm.api.dto;

import br.com.jcpm.api.domain.enums.UserType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String name;
    private String email;
    private UserType userType;
    private Boolean ativo;
    private String biografia;
    private String urlImagemPerfil;
}
