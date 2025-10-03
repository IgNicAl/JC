package br.com.jcpm.api.repository;

import br.com.jcpm.api.domain.entity.Follow;
import br.com.jcpm.api.domain.entity.Follow.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações de banco de dados relacionadas à entidade Follow.
 */
@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {

  /**
   * Conta quantos seguidores um determinado usuário possui.
   *
   * @param followedId O ID do usuário que está sendo seguido.
   * @return A contagem de seguidores.
   */
  long countByFollowedId(String followedId);

  /**
   * Conta quantos usuários um determinado usuário está seguindo.
   *
   * @param followerId O ID do usuário que segue outros.
   * @return A contagem de usuários seguidos.
   */
  long countByFollowerId(String followerId);

  /**
   * Verifica se um usuário segue outro.
   *
   * @param followerId O ID do potencial seguidor.
   * @param followedId O ID do usuário que é potencialmente seguido.
   * @return true se a relação de seguir existe, caso contrário false.
   */
  boolean existsByFollowerIdAndFollowedId(String followerId, String followedId);
}