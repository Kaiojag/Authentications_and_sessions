const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

//Middlewares
app.use(cors());            // Permite que qualquer front-end acesse este back-end
app.use(express.json());    // Permite que o servidor entenda dados JSON no corpo da requisição


// 🔸 Dados de usuários em memória
const usuarios = [
  {
    id: 1,
    email: 'admin@exemplo.com',
    senha: '123456',  // senha sem hash (ainda)
    papel: 'admin'
  },
  {
    id: 2,
    email: 'user@exemplo.com',
    senha: 'senha123',
    papel: 'user'
  }
];

// Rota GET simples para teste direto no navegador
app.get('/', (req, res) => {
  res.send(`
    <h1>Servidor Backend em funcionamento!</h1>
    <p>Use o front-end para testar o cadastro e login.</p>
    <p>Rotas disponíveis:</p>
    <ul>
      <li>POST /register</li>
      <li>POST /login</li>
    </ul>
  `);
});

// 🔹 Rota de cadastro
app.post('/register', (req, res) => {
  const { email, senha, papel } = req.body;

  // Verificação simples
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  // Verifica se o usuário já existe
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(409).json({ erro: 'Usuário já cadastrado' });
  }

  // Criação do novo usuário
  const novoUsuario = {
    id: usuarios.length + 1,
    email,
    senha, // sem hash por enquanto
    papel: papel || 'user'
  };

  usuarios.push(novoUsuario);
  res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
});

// 🔹 Rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);

  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  // Simula login bem-sucedido
  res.json({
    mensagem: 'Login bem-sucedido',
    usuario: {
      id: usuario.id,
      email: usuario.email,
      papel: usuario.papel
    }
  });
});

app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// 🔸 Inicia o servidor
app.listen(PORT, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
