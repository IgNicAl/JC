package br.com.jcpm.api.service;

import br.com.jcpm.api.dto.CommentDTO;
import br.com.jcpm.api.dto.DashboardStatsDTO;
import br.com.jcpm.api.dto.DashboardStatsDTO.NewsMetric;
import br.com.jcpm.api.dto.NewsDashboardDTO;
import br.com.jcpm.api.exception.ResourceNotFoundException;
import br.com.jcpm.api.repository.CommentRepository;
import br.com.jcpm.api.repository.LikeRepository;
import br.com.jcpm.api.repository.NewsRepository;
import br.com.jcpm.api.repository.UserRepository;
import br.com.jcpm.api.repository.ViewRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Serviço que implementa a lógica de negócio para os dashboards.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

  private final NewsRepository newsRepository;
  private final ViewRepository viewRepository;
  private final LikeRepository likeRepository;
  private final CommentRepository commentRepository;
  private final UserRepository userRepository;

  /**
   * Obtém estatísticas gerais para o dashboard do administrador.
   *
   * @return DTO com as estatísticas agregadas.
   */
  public DashboardStatsDTO getAdminDashboardStats() {
    // Implementação simplificada. Em produção, isso seria otimizado com queries diretas.
    List<NewsMetric> mostViewed =
        newsRepository.findAll().stream()
            .map(
                news ->
                    NewsMetric.builder()
                        .title(news.getTitle())
                        .slug(news.getSlug())
                        .count(viewRepository.countByNewsId(news.getId()))
                        .build())
            .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
            .limit(5)
            .collect(Collectors.toList());

    return DashboardStatsDTO.builder()
        .totalNews(newsRepository.count())
        .totalViews(viewRepository.count())
        .totalLikes(likeRepository.count())
        .totalComments(commentRepository.count())
        .totalUsers(userRepository.count())
        .mostViewedNews(mostViewed)
        // Lógica similar para mostLikedNews e mostCommentedNews
        .build();
  }

  /**
   * Obtém os dados para o dashboard de uma notícia específica.
   *
   * @param newsId O ID da notícia.
   * @return DTO com os dados do dashboard da notícia.
   */
  public NewsDashboardDTO getNewsDashboard(UUID newsId) {
    var news =
        newsRepository
            .findById(newsId)
            .orElseThrow(() -> new ResourceNotFoundException("Notícia não encontrada"));

    List<CommentDTO> recentComments =
        commentRepository.findByNewsIdOrderByCreatedAtDesc(newsId).stream()
            .limit(10)
            .map(
                comment ->
                    CommentDTO.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt())
                        .userId(comment.getUser().getId())
                        .userName(comment.getUser().getName())
                        .userProfileImageUrl(comment.getUser().getProfileImageUrl())
                        .build())
            .collect(Collectors.toList());

    List<Map<String, Object>> viewsOverTime = viewRepository.countViewsByDay(newsId);

    return NewsDashboardDTO.builder()
        .newsId(news.getId())
        .newsTitle(news.getTitle())
        .totalViews(viewRepository.countByNewsId(newsId))
        .totalLikes(likeRepository.countByNewsId(newsId))
        .totalComments(commentRepository.countByNewsId(newsId))
        .viewsOverTime(viewsOverTime)
        .recentComments(recentComments)
        .build();
  }
}