package br.com.jcpm.api.service;

import br.com.jcpm.api.domain.entity.Comment;
import br.com.jcpm.api.domain.entity.Like;
import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.entity.View;
import br.com.jcpm.api.dto.CommentDTO;
import br.com.jcpm.api.exception.ResourceNotFoundException;
import br.com.jcpm.api.repository.CommentRepository;
import br.com.jcpm.api.repository.LikeRepository;
import br.com.jcpm.api.repository.NewsRepository;
import br.com.jcpm.api.repository.ViewRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Serviço que implementa a lógica de negócio para engajamento dos usuários.
 */
@Service
@RequiredArgsConstructor
public class EngagementService {

  private final NewsRepository newsRepository;
  private final CommentRepository commentRepository;
  private final LikeRepository likeRepository;
  private final ViewRepository viewRepository;
  private final UserService userService;

  /**
   * Registra a visualização de uma notícia.
   *
   * @param newsId O ID da notícia.
   * @param request O HttpServletRequest para obter o IP e User-Agent.
   */
  @Transactional
  public void trackView(UUID newsId, HttpServletRequest request) {
    News news =
        newsRepository
            .findById(newsId)
            .orElseThrow(() -> new ResourceNotFoundException("Notícia não encontrada"));

    User user =
        userService
            .findByUsername(SecurityContextHolder.getContext().getAuthentication().getName())
            .orElse(null);

    View view =
        View.builder()
            .news(news)
            .user(user)
            .ipAddress(request.getRemoteAddr())
            .userAgent(request.getHeader("User-Agent"))
            .build();

    viewRepository.save(view);
  }

  /**
   * Adiciona um comentário a uma notícia.
   *
   * @param newsId O ID da notícia.
   * @param content O conteúdo do comentário.
   * @return O DTO do comentário criado.
   */
  @Transactional
  public CommentDTO addComment(UUID newsId, String content) {
    User currentUser =
        (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    News news =
        newsRepository
            .findById(newsId)
            .orElseThrow(() -> new ResourceNotFoundException("Notícia não encontrada"));

    Comment comment =
        Comment.builder().content(content).user(currentUser).news(news).build();
    comment = commentRepository.save(comment);

    return CommentDTO.builder()
        .id(comment.getId())
        .content(comment.getContent())
        .createdAt(comment.getCreatedAt())
        .userId(currentUser.getId())
        .userName(currentUser.getName())
        .userProfileImageUrl(currentUser.getProfileImageUrl())
        .build();
  }

  /**
   * Obtém os comentários de uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return Uma lista de DTOs de comentários.
   */
  public List<CommentDTO> getCommentsByNewsId(UUID newsId) {
    return commentRepository.findByNewsIdOrderByCreatedAtDesc(newsId).stream()
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
  }

  /**
   * Deleta um comentário.
   *
   * @param commentId O ID do comentário.
   */
  @Transactional
  public void deleteComment(UUID commentId) {
    // Adicionar lógica de permissão (apenas o dono do comentário ou admin pode deletar)
    commentRepository.deleteById(commentId);
  }

  /**
   * Alterna o estado de curtida de um usuário em uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return A nova contagem de curtidas.
   */
  @Transactional
  public long toggleLike(UUID newsId) {
    User currentUser =
        (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    News news =
        newsRepository
            .findById(newsId)
            .orElseThrow(() -> new ResourceNotFoundException("Notícia não encontrada"));

    likeRepository
        .findByUserIdAndNewsId(currentUser.getId(), newsId)
        .ifPresentOrElse(
            likeRepository::delete,
            () -> {
              Like newLike = Like.builder().user(currentUser).news(news).build();
              likeRepository.save(newLike);
            });

    return likeRepository.countByNewsId(newsId);
  }

  /**
   * Obtém as estatísticas de engajamento (curtidas e comentários) de uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return Um mapa com as contagens.
   */
  public Map<String, Object> getEngagementStats(UUID newsId) {
    long likeCount = likeRepository.countByNewsId(newsId);
    long commentCount = commentRepository.countByNewsId(newsId);
    boolean isLikedByCurrentUser = false;

    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof User) {
      User currentUser = (User) principal;
      isLikedByCurrentUser =
          likeRepository.findByUserIdAndNewsId(currentUser.getId(), newsId).isPresent();
    }

    return Map.of(
        "likeCount", likeCount,
        "commentCount", commentCount,
        "isLikedByCurrentUser", isLikedByCurrentUser);
  }
}