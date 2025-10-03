package br.com.jcpm.api.controller;

import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.enums.UserType;
import br.com.jcpm.api.dto.UserResponse;
import br.com.jcpm.api.dto.UserUpdateRequest; // Importar o novo DTO
import br.com.jcpm.api.service.UserService;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  public record UserStats(
      long totalUsers, long totalAdmins, long totalJournalists, long totalCommonUsers) {}

  @GetMapping("/perfil/{username}")
  public ResponseEntity<UserResponse> getPublicProfile(@PathVariable String username) {
    return userService
        .findByUsername(username)
        .map(user -> ResponseEntity.ok(new UserResponse(user)))
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserResponse> getMyProfile() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User user =
        userService
            .findByUsername(authentication.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    return ResponseEntity.ok(new UserResponse(user));
  }

  @PutMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserResponse> updateMyProfile(@RequestBody UserUpdateRequest userDetails) {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      User currentUser = userService.findByUsername(authentication.getName())
              .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

      currentUser.setName(userDetails.getName());
      currentUser.setEmail(userDetails.getEmail());
      currentUser.setBiography(userDetails.getBiografia());
      currentUser.setProfileImageUrl(userDetails.getUrlImagemPerfil());

      User updatedUser = userService.update(currentUser);
      return ResponseEntity.ok(new UserResponse(updatedUser));
  }


  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserResponse> getAllUsers() {
    return userService.findAll().stream().map(UserResponse::new).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
    return userService
        .findById(id)
        .map(user -> ResponseEntity.ok(new UserResponse(user)))
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> updateUser(
      @PathVariable UUID id, @RequestBody UserUpdateRequest userDetails) { // <-- Alterado para o DTO
    return userService
        .findById(id)
        .map(
            user -> {
              // Mapeamento manual e seguro
              user.setName(userDetails.getName());
              user.setEmail(userDetails.getEmail());
              user.setBiography(userDetails.getBiografia());
              user.setProfileImageUrl(userDetails.getUrlImagemPerfil());
              user.setUserType(userDetails.getUserType());
              user.setActive(userDetails.getAtivo());

              User updatedUser = userService.update(user);
              return ResponseEntity.ok(new UserResponse(updatedUser));
            })
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
    try {
      userService.deleteById(id);
      return ResponseEntity.noContent().build();
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{id}/ativar")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> activateUser(@PathVariable UUID id) {
    try {
      User user = userService.activateUser(id);
      return ResponseEntity.ok(new UserResponse(user));
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{id}/desativar")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> deactivateUser(@PathVariable UUID id) {
    try {
      User user = userService.deactivateUser(id);
      return ResponseEntity.ok(new UserResponse(user));
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/tipo/{tipoUser}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<UserResponse>> getUsersByType(@PathVariable("tipoUser") String userTypeString) {
    try {
      UserType type = UserType.valueOf(userTypeString.toUpperCase());
      List<UserResponse> users =
          userService.findByUserType(type).stream()
              .map(UserResponse::new)
              .collect(Collectors.toList());
      return ResponseEntity.ok(users);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/stats")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserStats> getUserStats() {
    long totalUsers = userService.countUsers();
    long totalAdmins = userService.countUsersByType(UserType.ADMIN);
    long totalJournalists = userService.countUsersByType(UserType.JOURNALIST);
    long totalCommonUsers = userService.countUsersByType(UserType.USER);

    return ResponseEntity.ok(
        new UserStats(totalUsers, totalAdmins, totalJournalists, totalCommonUsers));
  }
}
