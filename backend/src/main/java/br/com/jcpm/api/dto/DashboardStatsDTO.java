package br.com.jcpm.api.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para agregar as estatísticas gerais do sistema, exibidas no dashboard do administrador.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

  private long totalNews;
  private long totalViews;
  private long totalLikes;
  private long totalComments;
  private long totalUsers;
  private List<NewsMetric> mostViewedNews;
  private List<NewsMetric> mostLikedNews;
  private List<NewsMetric> mostCommentedNews;

  /**
   * Sub-DTO para representar métricas de uma notícia individual nos rankings.
   */
  @Data
  @Builder
  public static class NewsMetric {
    private String title;
    private String slug;
    private long count;
  }
}