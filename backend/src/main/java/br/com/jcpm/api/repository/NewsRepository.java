package br.com.jcpm.api.repository;

import br.com.jcpm.api.domain.entity.News;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações de banco de dados relacionadas à entidade News.
 */
@Repository
public interface NewsRepository extends JpaRepository<News, UUID> {
  List<News> findByAuthorId(UUID authorId);
}
