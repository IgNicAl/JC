-- Script para criar usuários de teste no sistema JCPM
-- Execute após a aplicação criar as tabelas automaticamente

-- Inserir usuários de teste
-- Senha BCrypt para "admcesar": $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- Senha BCrypt para "123456": $2a$10$JKlV4Z3p1iLF9mPq2ixu.OqQ3L7M9nF5YPsVzw0dIYzX8E9qJn7zC

INSERT INTO users (username, email, password, name, tipo_user, ativo, data_cadastro, biografia, url_imagem_perfil) VALUES
('admin', 'admin@jcpm.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador do Sistema', 'ADMIN', true, NOW(), 'Administrador responsável pelo sistema JCPM', 'https://via.placeholder.com/150'),
('jornalista1', 'jornalista1@jcpm.com', '$2a$10$JKlV4Z3p1iLF9mPq2ixu.OqQ3L7M9nF5YPsVzw0dIYzX8E9qJn7zC', 'Maria Silva', 'JORNALISTA', true, NOW(), 'Jornalista especializada em política e economia', 'https://via.placeholder.com/150'),
('jornalista2', 'jornalista2@jcpm.com', '$2a$10$JKlV4Z3p1iLF9mPq2ixu.OqQ3L7M9nF5YPsVzw0dIYzX8E9qJn7zC', 'João Santos', 'JORNALISTA', true, NOW(), 'Jornalista de esportes e entretenimento', 'https://via.placeholder.com/150'),
('user1', 'user1@jcpm.com', '$2a$10$JKlV4Z3p1iLF9mPq2ixu.OqQ3L7M9nF5YPsVzw0dIYzX8E9qJn7zC', 'Ana Costa', 'USER', true, NOW(), 'Leitora assídua de notícias', 'https://via.placeholder.com/150'),
('user2', 'user2@jcpm.com', '$2a$10$JKlV4Z3p1iLF9mPq2ixu.OqQ3L7M9nF5YPsVzw0dIYzX8E9qJn7zC', 'Pedro Oliveira', 'USER', true, NOW(), 'Interessado em tecnologia e inovação', 'https://via.placeholder.com/150');

-- Inserir notícias de exemplo
INSERT INTO noticias (title, summary, content, autor_id, url_imagem_destaque, data_publicacao) VALUES
('Economia brasileira mostra sinais de recuperação', 'PIB cresce 2% no último trimestre segundo dados do IBGE', 'O Instituto Brasileiro de Geografia e Estatística (IBGE) divulgou nesta terça-feira os dados do Produto Interno Bruto (PIB) do último trimestre, mostrando um crescimento de 2% em relação ao período anterior. Este resultado supera as expectativas dos analistas econômicos...', 2, 'https://via.placeholder.com/400x200', NOW()),
('Seleção brasileira vence amistoso por 3x1', 'Brasil se prepara para as próximas competições internacionais', 'A Seleção Brasileira de Futebol venceu o amistoso contra a Argentina por 3 a 1 na noite de ontem, no Estádio do Maracanã. Os gols foram marcados por Neymar, Vinícius Jr. e Casemiro...', 3, 'https://via.placeholder.com/400x200', NOW()),
('Nova tecnologia promete revolucionar energias renováveis', 'Cientistas desenvolvem painel solar 50% mais eficiente', 'Pesquisadores da Universidade de São Paulo desenvolveram uma nova tecnologia de painéis solares que promete ser 50% mais eficiente que os modelos atuais. A inovação pode revolucionar o setor de energias renováveis...', 2, 'https://via.placeholder.com/400x200', NOW());
