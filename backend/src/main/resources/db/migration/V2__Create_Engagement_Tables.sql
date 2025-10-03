-- V2__Create_Engagement_Tables.sql

-- Tabela para armazenar comentários nas notícias
CREATE TABLE comments (
    id CHAR(36) NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    user_id CHAR(36) NOT NULL,
    news_id CHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_id) REFERENCES noticias(id) ON DELETE CASCADE
);

-- Tabela para armazenar curtidas (likes) nas notícias
CREATE TABLE likes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    created_at DATETIME NOT NULL,
    user_id CHAR(36) NOT NULL,
    news_id CHAR(36) NOT NULL,
    UNIQUE (user_id, news_id), -- Garante que um usuário só pode curtir uma vez
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_id) REFERENCES noticias(id) ON DELETE CASCADE
);

-- Tabela para registrar visualizações de notícias
CREATE TABLE views (
    id CHAR(36) NOT NULL PRIMARY KEY,
    viewed_at DATETIME NOT NULL,
    user_id CHAR(36), -- Pode ser nulo para usuários anônimos
    news_id CHAR(36) NOT NULL,
    ip_address VARCHAR(45), -- Para ajudar a identificar usuários anônimos
    user_agent VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (news_id) REFERENCES noticias(id) ON DELETE CASCADE
);

-- Tabela para o sistema de "seguir" jornalistas
CREATE TABLE follows (
    follower_id CHAR(36) NOT NULL,
    followed_id CHAR(36) NOT NULL,
    PRIMARY KEY (follower_id, followed_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);