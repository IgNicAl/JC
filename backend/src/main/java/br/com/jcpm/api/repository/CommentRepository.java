package br.com.jcpm.api.repository;

import br.com.jcpm.api.domain.entity.Comment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações de banco de dados relacionadas à entidade Comment.
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

  /**
   * Encontra todos os comentários de uma notícia específica, ordenados por data de criação.
   *
   * @param newsId O ID da notícia.
   * @return Uma lista de comentários.
   */
  List<Comment> findByNewsIdOrderByCreatedAtDesc(UUID newsId);

  /**
   * Conta o número total de comentários para uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return A contagem de comentários.
   */
  long countByNewsId(UUID newsId);
}