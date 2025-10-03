package br.com.jcpm.api.controller;

import br.com.jcpm.api.dto.CommentDTO;
import br.com.jcpm.api.service.EngagementService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para gerenciar o engajamento do usuário (comentários, curtidas).
 */
@RestController
@RequestMapping("/api/news/{newsId}")
@RequiredArgsConstructor
public class EngagementController {

  private final EngagementService engagementService;

  /**
   * Registra uma visualização para uma notícia.
   *
   * @param newsId O ID da notícia.
   * @param request O objeto HttpServletRequest para obter informações do cliente.
   * @return Uma resposta vazia com status 204.
   */
  @PostMapping("/view")
  public ResponseEntity<Void> trackView(@PathVariable UUID newsId, HttpServletRequest request) {
    engagementService.trackView(newsId, request);
    return ResponseEntity.noContent().build();
  }

  /**
   * Adiciona um comentário a uma notícia.
   *
   * @param newsId O ID da notícia.
   * @param commentDTO O DTO contendo o texto do comentário.
   * @return O comentário criado.
   */
  @PostMapping("/comments")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<CommentDTO> addComment(
      @PathVariable UUID newsId, @Valid @RequestBody CommentDTO commentDTO) {
    CommentDTO createdComment = engagementService.addComment(newsId, commentDTO.getContent());
    return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
  }

  /**
   * Retorna todos os comentários de uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return Uma lista de DTOs de comentários.
   */
  @GetMapping("/comments")
  public ResponseEntity<List<CommentDTO>> getComments(@PathVariable UUID newsId) {
    List<CommentDTO> comments = engagementService.getCommentsByNewsId(newsId);
    return ResponseEntity.ok(comments);
  }

  /**
   * Deleta um comentário.
   *
   * @param newsId O ID da notícia (para escopo da rota).
   * @param commentId O ID do comentário a ser deletado.
   * @return Uma resposta vazia com status 204.
   */
  @DeleteMapping("/comments/{commentId}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Void> deleteComment(
      @PathVariable UUID newsId, @PathVariable UUID commentId) {
    engagementService.deleteComment(commentId);
    return ResponseEntity.noContent().build();
  }

  /**
   * Adiciona ou remove uma curtida de uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return Um mapa contendo o novo total de curtidas.
   */
  @PostMapping("/like")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Map<String, Long>> toggleLike(@PathVariable UUID newsId) {
    long likeCount = engagementService.toggleLike(newsId);
    return ResponseEntity.ok(Map.of("likeCount", likeCount));
  }

  /**
   * Retorna os dados de engajamento de uma notícia (total de curtidas e comentários).
   *
   * @param newsId O ID da notícia.
   * @return Um mapa com os totais de engajamento.
   */
  @GetMapping("/engagement-stats")
  public ResponseEntity<Map<String, Object>> getEngagementStats(@PathVariable UUID newsId) {
    Map<String, Object> stats = engagementService.getEngagementStats(newsId);
    return ResponseEntity.ok(stats);
  }
}