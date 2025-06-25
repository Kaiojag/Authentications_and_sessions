const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const bcrypt = require('bcrypt');

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
app.post('/register', async (req, res) => {
  const { email, senha, papel } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(409).json({ erro: 'Usuário já cadastrado' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10); // gera hash com custo 10

    const novoUsuario = {
      id: usuarios.length + 1,
      email,
      senha: hash, // salvando o hash, não a senha pura
      papel: papel || 'user'
    };

    usuarios.push(novoUsuario);
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao salvar usuário' });
  }
});

// 🔹 Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha);

  if (!senhaConfere) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

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
