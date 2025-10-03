package br.com.jcpm.api.domain.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa a entidade Notícia no banco de dados.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "noticias")
public class News {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "autor_id", nullable = false)
  private User author;

  @NotBlank(message = "Título é obrigatório")
  @Column(nullable = false)
  private String title;

  @NotBlank(message = "Slug é obrigatório")
  @Column(unique = true, nullable = false)
  private String slug;

  @NotBlank(message = "Resumo é obrigatório")
  @Column(length = 512, nullable = false)
  private String summary;

  @NotBlank(message = "Conteúdo é obrigatório")
  @Lob
  @Column(columnDefinition = "TEXT", nullable = false)
  private String content;

  @JdbcTypeCode(SqlTypes.JSON)
  @Lob
  @Column(columnDefinition = "JSON")
  private String contentJson;

  @NotBlank(message = "URL da imagem de destaque é obrigatória")
  @Column(nullable = false)
  private String featuredImageUrl;

  @NotNull(message = "Prioridade é obrigatória")
  @Column(nullable = false)
  private Integer priority = 1;

  @NotNull(message = "Status é obrigatório")
  @Column(nullable = false)
  private String status = "RASCUNHO"; // RASCUNHO ou PUBLICADO

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime publicationDate;

  @UpdateTimestamp private LocalDateTime updateDate;
}
