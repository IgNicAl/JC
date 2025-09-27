package br.com.jcpm.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Ponto de entrada principal para a aplicação Spring Boot JCPM API.
 */
@SpringBootApplication
@EnableJpaRepositories("br.com.jcpm.api.repository")
@EntityScan("br.com.jcpm.api.domain.entity")
public class JcpmApplication {

  /**
   * Método principal que inicializa a aplicação Spring.
   *
   * @param args Argumentos de linha de comando passados durante a inicialização.
   */
  public static void main(String[] args) {
    SpringApplication.run(JcpmApplication.class, args);
  }
}
