const resultado = document.getElementById('resultado');

function cadastrar() {
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;

  fetch('http://127.0.0.1:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  .then(res => res.json())
  .then(data => mostrarResultado(data))
  .catch(err => mostrarResultado({ erro: err.message }));
}

function logar() {
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  fetch('http://127.0.0.1:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // necessário para cookie de sessão
    body: JSON.stringify({ email, senha })
  })
  .then(res => res.json())
  .then(data => mostrarResultado(data))
  .catch(err => mostrarResultado({ erro: err.message }));
}

function mostrarResultado(obj) {
  resultado.textContent = JSON.stringify(obj, null, 2);
}

function listarUsuarios() {
  fetch('http://127.0.0.1:3000/usuarios')
    .then(res => res.json())
    .then(data => {
      const pre = document.getElementById('usuariosList');
      pre.textContent = JSON.stringify(data, null, 2);
    })
    .catch(err => {
      const pre = document.getElementById('usuariosList');
      pre.textContent = 'Erro ao buscar usuários: ' + err.message;
    });
}

function verPerfil() {
  fetch('http://127.0.0.1:3000/perfil', {
    method: 'GET',
    credentials: 'include' // envia cookie de sessão
  })
  .then(res => res.json())
  .then(data => mostrarResultado(data))
  .catch(err => mostrarResultado({ erro: err.message }));
}

function logout() {
  fetch('http://127.0.0.1:3000/logout', {
    method: 'POST',
    credentials: 'include' // envia cookie para destruir a sessão
  })
  .then(res => res.json())
  .then(data => mostrarResultado(data))
  .catch(err => mostrarResultado({ erro: err.message }));
}
