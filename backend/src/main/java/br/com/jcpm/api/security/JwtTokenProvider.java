package br.com.jcpm.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Utilitário para operações relacionadas a tokens JWT, como geração, validação e extração de
 * informações.
 */
@Component
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.expiration}")
  private Long expiration;

  /**
   * Extrai o nome de usuário (subject) de um token JWT.
   *
   * @param token O token JWT.
   * @return O nome de usuário contido no token.
   */
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  /**
   * Extrai a data de expiração de um token JWT.
   *
   * @param token O token JWT.
   * @return A data de expiração.
   */
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  /**
   * Extrai uma informação específica (claim) de um token JWT usando uma função resolver.
   *
   * @param token O token JWT.
   * @param claimsResolver A função que extrai o claim desejado.
   * @param <T> O tipo do claim a ser retornado.
   * @return O claim extraído.
   */
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  /**
   * Gera um novo token JWT para um usuário.
   *
   * @param userDetails Os detalhes do usuário para quem o token será gerado.
   * @return O token JWT como uma string.
   */
  public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, userDetails.getUsername());
  }

  /**
   * Valida um token JWT.
   *
   * @param token O token a ser validado.
   * @param userDetails Os detalhes do usuário para comparação.
   * @return true se o token for válido, false caso contrário.
   */
  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secret.getBytes());
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
  }
}
