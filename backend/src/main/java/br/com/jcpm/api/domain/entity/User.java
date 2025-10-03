package br.com.jcpm.api.domain.entity;

import br.com.jcpm.api.domain.enums.UserType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Representa a entidade Usuário no banco de dados e implementa a interface UserDetails do Spring Security.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserType userType = UserType.USER;

  @NotBlank(message = "Name é obrigatório")
  @Column(nullable = false)
  private String name;

  @NotBlank(message = "Username é obrigatório")
  @Size(min = 3, max = 20, message = "Username deve ter entre 3 e 20 caracteres")
  @Column(unique = true, nullable = false)
  private String username;

  @NotBlank(message = "Email é obrigatório")
  @Email(message = "Email deve ser válido")
  @Column(unique = true, nullable = false)
  private String email;

  @NotBlank(message = "Password é obrigatório")
  @Column(nullable = false)
  private String password;

  @Column(length = 512)
  private String profileImageUrl;

  @Column(length = 1024)
  private String biography;

  private String gender;

  private LocalDate birthDate;

  @Column(nullable = false)
  private Boolean active = true;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime registrationDate;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + userType.name()));
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return this.active;
  }
}
