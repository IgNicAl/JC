package br.com.jcpm.api.repository;

import br.com.jcpm.api.domain.entity.Like;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações de banco de dados relacionadas à entidade Like.
 */
@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {

  /**
   * Encontra uma curtida por um usuário específico em uma notícia específica.
   *
   * @param userId O ID do usuário.
   * @param newsId O ID da notícia.
   * @return Um Optional contendo a curtida, se existir.
   */
  Optional<Like> findByUserIdAndNewsId(UUID userId, UUID newsId);

  /**
   * Conta o número total de curtidas para uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return A contagem de curtidas.
   */
  long countByNewsId(UUID newsId);
}