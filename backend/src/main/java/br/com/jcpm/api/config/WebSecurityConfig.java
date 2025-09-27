package br.com.jcpm.api.config;

import br.com.jcpm.api.security.JwtAuthenticationEntryPoint;
import br.com.jcpm.api.security.JwtRequestFilter;
import br.com.jcpm.api.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Configuração central de segurança da aplicação utilizando Spring Security.
 * Habilita a segurança web e a segurança baseada em métodos (como @PreAuthorize).
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final UserService userService;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final JwtRequestFilter jwtRequestFilter;

  /**
   * Cria um bean para o codificador de senhas.
   *
   * @return Uma instância de BCryptPasswordEncoder para a codificação de senhas.
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * Configura o provedor de autenticação que utiliza o UserService e o PasswordEncoder.
   *
   * @return Uma instância de DaoAuthenticationProvider configurada.
   */
  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  /**
   * Expõe o AuthenticationManager do Spring Security como um bean.
   *
   * @param authConfig A configuração de autenticação do Spring.
   * @return O AuthenticationManager gerenciado pelo Spring.
   * @throws Exception se houver erro ao obter o AuthenticationManager.
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
      throws Exception {
    return authConfig.getAuthenticationManager();
  }

  /**
   * Define a cadeia de filtros de segurança que processa as requisições HTTP.
   *
   * @param http O objeto HttpSecurity a ser configurado.
   * @return A cadeia de filtros de segurança construída.
   * @throws Exception se houver erro na configuração.
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth ->
                auth
                    .requestMatchers("/api/auth/**")
                    .permitAll()
                    .requestMatchers("/api/init/**")
                    .permitAll()
                    .requestMatchers("/api/noticias/**")
                    .permitAll()
                    .requestMatchers("/api/users/perfil/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated());

    http.authenticationProvider(authenticationProvider());
    http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  /**
   * Configura as políticas de Cross-Origin Resource Sharing (CORS) para a aplicação.
   *
   * @return A fonte de configuração CORS.
   */
  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
