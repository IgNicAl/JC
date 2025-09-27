**Objetivo:** Desenvolver um portal de notícias com frontend em React.js e backend em Java (utilizando o framework Spring Boot). O sistema deve permitir a visualização e o gerenciamento de notícias através de uma API RESTful.

**Requisitos do Frontend (React.js):**

1. **Página Inicial:** Deve exibir uma lista ou grid com as notícias mais recentes. Cada notícia deve mostrar uma imagem de destaque, o título e um summary.
2. **Página de Leitura da Notícia:** Ao clicar em uma notícia na página inicial, o usuário será redirecionado para uma página que exibe o conteúdo completo do artigo (título, imagem, data de publicação, autor e o texto completo).
3. **Componentização:** O código React deve ser organizado em componentes reutilizáveis (ex: CardNoticia, BarraDeNavegacao, Rodape).
4. **Comunicação com a API:** Utilizar a biblioteca axios ou a fetch API nativa para consumir os dados do backend Java.
5. **Design Responsivo:** A interface deve ser totalmente adaptável para visualização em desktops, tablets e smartphones.

**Requisitos do Backend (Java com Spring Boot):**

1. **API RESTful:** Construir uma API com os seguintes endpoints (rotas):
   * GET /api/noticias: Retorna uma lista de todas as notícias publicadas.
   * GET /api/noticias/{id}: Retorna os detalhes de uma notícia específica pelo seu ID.
   * POST /api/noticias: Cria uma nova notícia no banco de dados (endpoint deve ser protegido).
   * PUT /api/noticias/{id}: Atualiza uma notícia existente (endpoint deve ser protegido).
   * DELETE /api/noticias/{id}: Remove uma notícia do banco de dados (endpoint deve ser protegido).
2. **Acesso ao Banco de Dados:** Utilizar o Spring Data JPA para simplificar a comunicação com o banco de dados.

**Requisitos do Banco de Dados:**

1. **Tecnologia:** Utilizar o banco de dados relacional **MySQL**.
2. **Modelo de Dados (Tabela Noticias):**
   * id (Chave Primária, Numérico, Auto-Incremento)
   * title (Texto, Obrigatório)
   * summary (Texto)
   * content (Texto longo)
   * autor (Texto)
   * url\_imagem\_destaque (Texto)
   * data\_publicacao (Data e Hora, Obrigatório)

