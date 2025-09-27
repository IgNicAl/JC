package br.com.jcpm.api.security;

import br.com.jcpm.api.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtro que intercepta todas as requisições para validar o token JWT.
 * Executa uma vez por requisição.
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

  @Autowired private UserService userService;

  @Autowired private JwtTokenProvider jwtTokenProvider;

  /**
   * Processa a requisição, extrai e valida o token JWT, e configura o contexto de segurança.
   *
   * @param request A requisição HTTP.
   * @param response A resposta HTTP.
   * @param chain A cadeia de filtros.
   * @throws ServletException se ocorrer um erro de servlet.
   * @throws IOException se ocorrer um erro de I/O.
   */
  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    final String requestTokenHeader = request.getHeader("Authorization");

    String username = null;
    String jwtToken = null;

    if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
      jwtToken = requestTokenHeader.substring(7);
      try {
        username = jwtTokenProvider.extractUsername(jwtToken);
      } catch (Exception e) {
        // NOTE: A mensagem de log original foi mantida, mas poderia ser mais específica.
        logger.error("Unable to get JWT Token");
      }
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = this.userService.loadUserByUsername(username);

      if (jwtTokenProvider.validateToken(jwtToken, userDetails)) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
            new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        usernamePasswordAuthenticationToken.setDetails(
            new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
      }
    }
    chain.doFilter(request, response);
  }
}
