package br.com.jcpm.api.domain.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa a relação de "seguir" entre dois usuários.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "follows")
public class Follow {

  @EmbeddedId
  private FollowId id;

  @ManyToOne
  @MapsId("followerId")
  @JoinColumn(name = "follower_id")
  private User follower;

  @ManyToOne
  @MapsId("followedId")
  @JoinColumn(name = "followed_id")
  private User followed;

  /**
   * Chave primária composta para a entidade Follow.
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class FollowId implements Serializable {
    private String followerId;
    private String followedId;
  }
}