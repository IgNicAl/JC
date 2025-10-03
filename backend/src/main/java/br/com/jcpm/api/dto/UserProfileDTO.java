package br.com.jcpm.api.dto;

import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.enums.UserType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para exibir o perfil público de um usuário, incluindo suas notícias (se for jornalista).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {

  private UUID id;
  private String name;
  private String username;
  private String biography;
  private String profileImageUrl;
  private UserType userType;
  private LocalDateTime registrationDate;
  private long followersCount;
  private long followingCount;
  private boolean isFollowedByCurrentUser;
  private List<NewsSummaryDTO> publishedNews;

  /**
   * Sub-DTO para resumir as notícias no perfil do jornalista.
   */
  @Data
  @Builder
  public static class NewsSummaryDTO {
    private String title;
    private String slug;
    private String summary;
    private LocalDateTime publicationDate;
    private String featuredImageUrl;
  }
}