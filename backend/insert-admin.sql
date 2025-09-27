-- Script para inserir o usuário administrador no banco de dados JCPM
-- Execute este comando no MySQL Workbench ou linha de comando do MySQL

-- Conectar ao banco de dados (se necessário)
-- USE jcpm_db;

-- Inserir usuário administrador
-- Senha: admcesar
-- Hash BCrypt: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (
    username,
    email,
    password,
    name,
    tipo_user,
    ativo,
    data_cadastro,
    biografia,
    url_imagem_perfil
) VALUES (
    'admin',
    'admin@jcpm.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador do Sistema',
    'ADMIN',
    true,
    NOW(),
    'Administrador responsável pelo sistema JCPM',
    'https://via.placeholder.com/150'
);

-- Verificar se o usuário foi inserido
SELECT id, username, email, name, tipo_user, ativo, data_cadastro
FROM users
WHERE username = 'admin';
