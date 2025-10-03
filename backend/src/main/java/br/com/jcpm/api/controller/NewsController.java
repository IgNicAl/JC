package br.com.jcpm.api.controller;

import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.dto.NewsRequest;
import br.com.jcpm.api.repository.NewsRepository;
import jakarta.validation.Valid;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/noticias")
public class NewsController {

  private final NewsRepository newsRepository;

  @Autowired
  public NewsController(NewsRepository newsRepository) {
    this.newsRepository = newsRepository;
  }

  private String generateSlug(String title) {
    String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    String slug = pattern.matcher(normalized).replaceAll("");
    slug = slug.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", "");

    int count = 1;
    String finalSlug = slug;
    while (newsRepository.existsBySlug(finalSlug)) {
        finalSlug = slug + "-" + count++;
    }
    return finalSlug;
  }

  @GetMapping
  public ResponseEntity<List<News>> getAllPublicNews() {
    return ResponseEntity.ok(newsRepository.findAllByStatusOrderByPublicationDateDesc("PUBLICADO"));
  }

  // ROTA CORRIGIDA para evitar ambiguidade
  @GetMapping("/slug/{slug}")
  public ResponseEntity<News> getNewsBySlug(@PathVariable String slug) {
    return newsRepository
        .findBySlug(slug)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping("/manage")
  @PreAuthorize("hasRole('ADMIN') or hasRole('JOURNALIST')")
  public ResponseEntity<List<News>> getNewsForManagement() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    if ("ADMIN".equals(currentUser.getUserType().name())) {
      return ResponseEntity.ok(newsRepository.findAll());
    }

    return ResponseEntity.ok(newsRepository.findByAuthorId(currentUser.getId()));
  }

  // Esta rota agora é única para UUIDs
  @GetMapping("/{id}")
  public ResponseEntity<News> getNewsById(@PathVariable UUID id) {
    return newsRepository
        .findById(id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  @PreAuthorize("hasRole('JOURNALIST') or hasRole('ADMIN')")
  public ResponseEntity<News> createNews(@Valid @RequestBody NewsRequest newsRequest) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    News news = new News();
    news.setTitle(newsRequest.getTitle());
    news.setSlug(generateSlug(newsRequest.getTitle()));
    news.setSummary(newsRequest.getSummary());
    news.setContent(newsRequest.getContent());
    news.setContentJson(newsRequest.getContentJson());
    news.setFeaturedImageUrl(newsRequest.getFeaturedImageUrl());
    news.setPriority(newsRequest.getPriority());
    news.setAuthor(currentUser);
    news.setPublicationDate(LocalDateTime.now());
    news.setStatus(newsRequest.getStatus() != null ? newsRequest.getStatus() : "PUBLICADO");

    News savedNews = newsRepository.save(news);
    return new ResponseEntity<>(savedNews, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('JOURNALIST')")
  public ResponseEntity<?> updateNews(@PathVariable UUID id, @Valid @RequestBody NewsRequest newsRequest) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    return newsRepository
        .findById(id)
        .map(
            news -> {
              boolean isOwner = news.getAuthor().getId().equals(currentUser.getId());
              boolean isAdmin = "ADMIN".equals(currentUser.getUserType().name());

              if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                        Collections.singletonMap(
                            "error", "Você não tem permissão para editar esta notícia."));
              }

              news.setTitle(newsRequest.getTitle());
              news.setSummary(newsRequest.getSummary());
              news.setContent(newsRequest.getContent());
              news.setContentJson(newsRequest.getContentJson());
              news.setFeaturedImageUrl(newsRequest.getFeaturedImageUrl());
              news.setPriority(newsRequest.getPriority());
              news.setUpdateDate(LocalDateTime.now());
              news.setStatus(newsRequest.getStatus() != null ? newsRequest.getStatus() : news.getStatus());

              News updatedNews = newsRepository.save(news);
              return ResponseEntity.ok(updatedNews);
            })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('JOURNALIST')")
  public ResponseEntity<?> deleteNews(@PathVariable UUID id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    return newsRepository
        .findById(id)
        .map(
            news -> {
              boolean isOwner = news.getAuthor().getId().equals(currentUser.getId());
              boolean isAdmin = "ADMIN".equals(currentUser.getUserType().name());

              if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                        Collections.singletonMap(
                            "error", "Você não tem permissão para excluir esta notícia."));
              }

              newsRepository.delete(news);
              return ResponseEntity.noContent().build();
            })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
