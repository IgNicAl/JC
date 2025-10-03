package br.com.jcpm.api.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para os dados detalhados do dashboard de uma notícia específica.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsDashboardDTO {

  private UUID newsId;
  private String newsTitle;
  private long totalViews;
  private long totalLikes;
  private long totalComments;
  private List<Map<String, Object>> viewsOverTime; // Ex: [{"date": "2024-10-01", "views": 150}]
  private List<CommentDTO> recentComments;
}