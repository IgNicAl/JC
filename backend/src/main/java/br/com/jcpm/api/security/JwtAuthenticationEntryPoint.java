package br.com.jcpm.api.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Componente que trata de tentativas de acesso não autorizadas, rejeitando a requisição com um erro 401.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  /**
   * Método invocado sempre que um usuário não autenticado tenta acessar um recurso protegido.
   *
   * @param request A requisição que resultou em uma AuthenticationException.
   * @param response A resposta para que o cliente possa ser informado.
   * @param authException A exceção de autenticação que foi lançada.
   * @throws IOException Em caso de erro de I/O.
   */
  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException {
    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
  }
}
