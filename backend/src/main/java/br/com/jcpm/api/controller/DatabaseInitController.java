package br.com.jcpm.api.controller;

import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.enums.UserType;
import br.com.jcpm.api.service.UserService;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para inicialização de dados básicos no sistema, como usuários de teste e administrador.
 * // TODO: Este controlador deve ser usado apenas em ambiente de desenvolvimento e desabilitado em
 * produção.
 */
@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseInitController {

  @Autowired private UserService userService;

  @Autowired private PasswordEncoder passwordEncoder;

  /**
   * Cria o usuário administrador padrão se ele ainda não existir.
   *
   * @return Uma mensagem indicando o resultado da operação.
   */
  @PostMapping("/create-admin")
  public ResponseEntity<?> createAdmin() {
    try {
      if (userService.existsByUsername("admin")) {
        return ResponseEntity.ok("Administrador já existe no sistema!");
      }

      User admin = new User();
      admin.setUsername("admin");
      admin.setEmail("admin@jcpm.com");
      admin.setPassword(passwordEncoder.encode("admcesar"));
      admin.setName("Administrador do Sistema");
      admin.setUserType(UserType.ADMIN);
      admin.setActive(true);
      admin.setRegistrationDate(LocalDateTime.now());
      admin.setBiography("Administrador responsável pelo sistema JCPM");
      admin.setProfileImageUrl("https://via.placeholder.com/150");

      userService.save(admin);

      return ResponseEntity.ok(
          "Administrador criado com sucesso!\nUsername: admin\nSenha: admcesar");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Erro ao criar administrador: " + e.getMessage());
    }
  }

  /**
   * Cria um conjunto de usuários de teste (jornalistas e usuários comuns) se eles não existirem.
   *
   * @return Uma mensagem indicando o resultado da operação.
   */
  @PostMapping("/create-test-users")
  public ResponseEntity<?> createTestUsers() {
    try {
      if (!userService.existsByUsername("jornalista1")) {
        User journalist1 = new User();
        journalist1.setUsername("jornalista1");
        journalist1.setEmail("jornalista1@jcpm.com");
        journalist1.setPassword(passwordEncoder.encode("123456"));
        journalist1.setName("Maria Silva");
        journalist1.setUserType(UserType.JOURNALIST);
        journalist1.setActive(true);
        journalist1.setRegistrationDate(LocalDateTime.now());
        journalist1.setBiography("Jornalista especializada em política e economia");
        journalist1.setProfileImageUrl("https://via.placeholder.com/150");
        userService.save(journalist1);
      }

      if (!userService.existsByUsername("jornalista2")) {
        User journalist2 = new User();
        journalist2.setUsername("jornalista2");
        journalist2.setEmail("jornalista2@jcpm.com");
        journalist2.setPassword(passwordEncoder.encode("123456"));
        journalist2.setName("João Santos");
        journalist2.setUserType(UserType.JOURNALIST);
        journalist2.setActive(true);
        journalist2.setRegistrationDate(LocalDateTime.now());
        journalist2.setBiography("Jornalista de esportes e entretenimento");
        journalist2.setProfileImageUrl("https://via.placeholder.com/150");
        userService.save(journalist2);
      }

      if (!userService.existsByUsername("user1")) {
        User commonUser1 = new User();
        commonUser1.setUsername("user1");
        commonUser1.setEmail("user1@jcpm.com");
        commonUser1.setPassword(passwordEncoder.encode("123456"));
        commonUser1.setName("Ana Costa");
        commonUser1.setUserType(UserType.USER);
        commonUser1.setActive(true);
        commonUser1.setRegistrationDate(LocalDateTime.now());
        commonUser1.setBiography("Leitora assídua de notícias");
        commonUser1.setProfileImageUrl("https://via.placeholder.com/150");
        userService.save(commonUser1);
      }

      if (!userService.existsByUsername("user2")) {
        User commonUser2 = new User();
        commonUser2.setUsername("user2");
        commonUser2.setEmail("user2@jcpm.com");
        commonUser2.setPassword(passwordEncoder.encode("123456"));
        commonUser2.setName("Pedro Oliveira");
        commonUser2.setUserType(UserType.USER);
        commonUser2.setActive(true);
        commonUser2.setRegistrationDate(LocalDateTime.now());
        commonUser2.setBiography("Interessado em tecnologia e inovação");
        commonUser2.setProfileImageUrl("https://via.placeholder.com/150");
        userService.save(commonUser2);
      }

      return ResponseEntity.ok("Usuários de teste criados com sucesso!");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Erro ao criar usuários de teste: " + e.getMessage());
    }
  }
}
