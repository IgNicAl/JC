package br.com.jcpm.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para a criação e atualização de notícias.
 */
@Getter
@Setter
public class NewsRequest {

  @NotBlank(message = "Título não pode ser vazio")
  @Size(min = 5, max = 255, message = "Título deve ter entre 5 e 255 caracteres")
  private String title;

  @NotBlank(message = "Resumo não pode ser vazio")
  private String summary;

  @NotBlank(message = "Conteúdo não pode ser vazio")
  private String content;

  @NotBlank(message = "URL da imagem não pode ser vazia")
  private String featuredImageUrl;

  @NotNull(message = "Prioridade não pode ser nula")
  private Integer priority;
}
