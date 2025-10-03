package br.com.jcpm.api.repository;

import br.com.jcpm.api.domain.entity.View;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações de banco de dados relacionadas à entidade View.
 */
@Repository
public interface ViewRepository extends JpaRepository<View, UUID> {

  /**
   * Conta o número total de visualizações para uma notícia.
   *
   * @param newsId O ID da notícia.
   * @return A contagem de visualizações.
   */
  long countByNewsId(UUID newsId);

  /**
   * Agrupa as visualizações por dia para uma notícia específica.
   *
   * @param newsId O ID da notícia.
   * @return Uma lista de mapas, onde cada mapa contém a data e a contagem de visualizações.
   */
  @Query(
      "SELECT new map(FUNCTION('DATE', v.viewedAt) as date, COUNT(v) as views) "
          + "FROM View v WHERE v.news.id = :newsId GROUP BY FUNCTION('DATE', v.viewedAt) "
          + "ORDER BY FUNCTION('DATE', v.viewedAt) ASC")
  List<Map<String, Object>> countViewsByDay(@Param("newsId") UUID newsId);
}