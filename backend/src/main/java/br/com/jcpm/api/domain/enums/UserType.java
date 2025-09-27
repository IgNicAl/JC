package br.com.jcpm.api.domain.enums;

/**
 * Enum que define os tipos (perfis) de usuários no sistema.
 */
public enum UserType {
  USER("User"),
  JOURNALIST("Jornalista"),
  ADMIN("Administrador");

  private final String description;

  UserType(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
