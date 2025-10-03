package br.com.jcpm.api.controller;

import br.com.jcpm.api.dto.DashboardStatsDTO;
import br.com.jcpm.api.dto.NewsDashboardDTO;
import br.com.jcpm.api.service.DashboardService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para fornecer dados para os dashboards analíticos.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService dashboardService;

  /**
   * Retorna as estatísticas gerais para o dashboard de administradores.
   *
   * @return Um DTO com as estatísticas agregadas.
   */
  @GetMapping("/admin-stats")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DashboardStatsDTO> getAdminDashboardStats() {
    DashboardStatsDTO stats = dashboardService.getAdminDashboardStats();
    return ResponseEntity.ok(stats);
  }

  /**
   * Retorna as estatísticas detalhadas de uma notícia específica.
   *
   * @param newsId O ID da notícia.
   * @return Um DTO com as métricas da notícia.
   */
  @GetMapping("/news/{newsId}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('JOURNALIST')")
  public ResponseEntity<NewsDashboardDTO> getNewsDashboard(@PathVariable UUID newsId) {
    NewsDashboardDTO dashboardData = dashboardService.getNewsDashboard(newsId);
    return ResponseEntity.ok(dashboardData);
  }
}