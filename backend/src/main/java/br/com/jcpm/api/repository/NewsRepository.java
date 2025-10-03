package br.com.jcpm.api.repository;

import br.com.jcpm.api.domain.entity.News;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, UUID> {
  List<News> findByAuthorId(UUID authorId);
  Optional<News> findBySlug(String slug);
  boolean existsBySlug(String slug);
  List<News> findAllByStatusOrderByPublicationDateDesc(String status);
}
