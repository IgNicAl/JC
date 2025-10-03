package br.com.jcpm.api.controller;

import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.dto.JwtResponse;
import br.com.jcpm.api.dto.LoginRequest;
import br.com.jcpm.api.dto.RegisterRequest;
import br.com.jcpm.api.dto.UserResponse;
import br.com.jcpm.api.security.JwtTokenProvider;
import br.com.jcpm.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador responsável pelos endpoints de autenticação e registro de usuários.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final UserService userService;
  private final JwtTokenProvider jwtTokenProvider;

  /**
   * Autentica um usuário e retorna um token JWT.
   *
   * @param loginRequest Objeto com as credenciais de login.
   * @return ResponseEntity contendo o token JWT e informações do usuário.
   */
  @PostMapping("/login")
  public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    User userPrincipal = (User) authentication.getPrincipal();
    String jwt = jwtTokenProvider.generateToken(userPrincipal);

    return ResponseEntity.ok(
        new JwtResponse(
            jwt,
            userPrincipal.getId(),
            userPrincipal.getUsername(),
            userPrincipal.getEmail(),
            userPrincipal.getName(),
            userPrincipal.getUserType()));
  }

  /**
   * Registra um novo usuário no sistema.
   *
   * @param registerRequest Objeto com os dados para registro do novo usuário.
   * @return ResponseEntity com os dados do usuário criado.
   */
  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
    User user = new User();
    user.setUsername(registerRequest.getUsername());
    user.setEmail(registerRequest.getEmail());
    user.setPassword(registerRequest.getPassword());
    user.setName(registerRequest.getName());
    user.setUserType(registerRequest.getUserType());
    user.setBiography(registerRequest.getBiography());
    user.setProfileImageUrl(registerRequest.getProfileImageUrl());
    user.setGender(registerRequest.getGender());
    user.setBirthDate(registerRequest.getBirthDate());

    User savedUser = userService.save(user);

    return ResponseEntity.ok(new UserResponse(savedUser));
  }
}
