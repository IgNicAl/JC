package br.com.jcpm.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para transferir dados de comentários entre o frontend e o backend.
 * Representa um comentário feito em uma notícia.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {

  private UUID id;

  @NotBlank(message = "O conteúdo do comentário não pode ser vazio")
  private String content;

  private LocalDateTime createdAt;
  private UUID userId;
  private String userName;
  private String userProfileImageUrl;
}