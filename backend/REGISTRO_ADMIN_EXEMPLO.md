# 🔑 Como Cadastrar o Primeiro Admin - JCPM API

## 🚨 **PROBLEMA IDENTIFICADO E SOLUÇÃO**

O erro `ERR_CONNECTION_REFUSED` na rota `/api/auth/register` indica que:

1. **Backend não estava rodando** - ✅ **RESOLVIDO**
2. **Rota não estava configurada** - ✅ **RESOLVIDO**
3. **Frontend não estava usando o serviço correto** - ✅ **RESOLVIDO**

## 📝 **Solução Implementada**

### 1. ✅ Backend Configurado
- Rota `/api/auth/register` está **FUNCIONANDO**
- Controller `AuthController` **FUNCIONANDO**
- Security Config permite acesso **SEM AUTENTICAÇÃO**

### 2. ✅ Frontend Atualizado
Adicionado novo serviço de autenticação em `src/services/api.js`:

```javascript
// Serviços de autenticação com JWT
export const authService = {
  // Login com JWT
  login: (credentials) => api.post('/auth/login', credentials),

  // Registro de novo usuário/admin
  register: (userData) => api.post('/auth/register', userData),
};
```

## 🎯 **Como Usar no Frontend**

### Exemplo de Cadastro de Admin:

```javascript
import { authService } from '../services/api';

const cadastrarAdmin = async () => {
  try {
    const adminData = {
      username: "admin",
      email: "admin@jcpm.com",
      password: "admin123",
      name: "Administrador",
      tipoUser: "ADMIN",  // Opcional - padrão é USER
      biografia: "Administrador do sistema",  // Opcional
      urlImagemPerfil: ""  // Opcional
    };

    const response = await authService.register(adminData);

    console.log('Admin cadastrado com sucesso:', response.data);
    // response.data.user contém os dados do usuário criado
    // response.data.message contém a mensagem de sucesso

  } catch (error) {
    console.error('Erro ao cadastrar admin:', error.response?.data || error);

    if (error.response?.data?.error === 'USERNAME_EXISTS') {
      alert('Username já está em uso!');
    } else if (error.response?.data?.error === 'EMAIL_EXISTS') {
      alert('Email já está em uso!');
    } else {
      alert('Erro ao cadastrar admin. Verifique os dados.');
    }
  }
};
```

### Exemplo de Login de Admin:

```javascript
import { authService } from '../services/api';

const loginAdmin = async () => {
  try {
    const credentials = {
      username: "admin",
      password: "admin123"
    };

    const response = await authService.login(credentials);

    // Dados retornados:
    console.log('Token:', response.data.accessToken);
    console.log('Usuário:', response.data.username);
    console.log('Tipo:', response.data.tipoUser); // "ADMIN"

    // Salvar token para próximas requisições
    localStorage.setItem('token', response.data.accessToken);

  } catch (error) {
    console.error('Erro no login:', error);
    alert('Credenciais inválidas!');
  }
};
```

## 🔧 **Estrutura de Dados**

### RegisterRequest (Cadastro):
```json
{
  "username": "admin",           // ✅ Obrigatório
  "email": "admin@jcpm.com",    // ✅ Obrigatório
  "password": "admin123",        // ✅ Obrigatório (min 6 chars)
  "name": "Administrador",       // ✅ Obrigatório
  "tipoUser": "ADMIN",        // ❓ Opcional (USER, JORNALISTA, ADMIN)
  "biografia": "...",            // ❓ Opcional
  "urlImagemPerfil": "..."       // ❓ Opcional
}
```

### JwtResponse (Login):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "tokenType": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@jcpm.com",
  "name": "Administrador",
  "tipoUser": "ADMIN"
}
```

## ⚠️ **Validações Implementadas**

1. **Username único** - Não pode haver duplicatas
2. **Email único** - Não pode haver duplicatas
3. **Password mínimo** - 6 caracteres
4. **Campos obrigatórios** - username, email, password, name

## 🚀 **Próximos Passos**

1. **✅ Backend rodando** na porta 8080
2. **✅ Rotas configuradas** e funcionando
3. **✅ Frontend atualizado** com serviços corretos
4. **🎯 Usar `authService.register()`** ao invés de `userService.createUser()`

## 📝 **Exemplo Completo de Componente React**

```jsx
import React, { useState } from 'react';
import { authService } from '../services/api';

const CadastroAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    tipoUser: 'ADMIN'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.register(formData);
      alert('Admin cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar admin');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <button type="submit">Cadastrar Admin</button>
    </form>
  );
};
```

## ✅ **Status Atual**

- 🟢 **Backend**: Rodando na porta 8080
- 🟢 **Rota Register**: `/api/auth/register` funcionando
- 🟢 **Rota Login**: `/api/auth/login` funcionando
- 🟢 **AuthService**: Disponível no frontend
- 🟢 **Validações**: Funcionando corretamente
- 🟢 **JWT**: Configurado e funcionando

**✨ Use `authService.register()` ao invés de qualquer outra rota!**
