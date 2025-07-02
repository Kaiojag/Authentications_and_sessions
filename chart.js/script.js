const btnAdicionar = document.getElementById('btnAdicionar');
const btnMostrarGrafico = document.getElementById('btnMostrarGrafico');
const ulGastos = document.getElementById('ulGastos');
const ctx = document.getElementById('graficoPizza');
//const ctx = canvasGrafico.getContext('2d');

// Array para armazenar os gastos individuais em objetos.    
const listaDeGastos = [];

// Inicialmente nenhum gráfico
let grafico = null;

// Função para atualizar a lista visualmente
function atualizarLista() {
  ulGastos.innerHTML = ''; // limpa lista
  listaDeGastos.forEach((gasto) => {
    const li = document.createElement('li');
    li.textContent = `R$ ${gasto.valor.toFixed(2)} - ${gasto.categoria}`;
    ulGastos.appendChild(li);
  });
}

// Função para agregar gastos por categoria e retornar objeto
function agregadorPorCategoria() {
  const agregados = {
    "Alimentação": 0,
    "Transporte": 0,
    "Lazer": 0
  };

  listaDeGastos.forEach(gasto => {
    agregados[gasto.categoria] += gasto.valor;
  });

  return agregados;
}

btnAdicionar.addEventListener('click', () => {
  const valorInput = document.getElementById('valor');
  const categoriaInput = document.getElementById('categoria');

  const valor = parseFloat(valorInput.value);
  const categoria = categoriaInput.value;

  if (isNaN(valor) || valor <= 0) {
    alert('Por favor, insira um valor válido.');
    return;
  }

  if (!categoria) {
    alert('Por favor, selecione uma categoria.');
    return;
  }

  listaDeGastos.push({ valor, categoria });

  atualizarLista();

  // Limpa o formulário após adicionar
  valorInput.value = '';
  categoriaInput.selectedIndex = 0;

  // Esconde o gráfico se estiver visível para forçar atualização no próximo clique
  //canvasGrafico
  ctx.style.display = 'none';
});

btnMostrarGrafico.addEventListener('click', () => {
  if (listaDeGastos.length === 0) {
    alert('Adicione pelo menos um gasto antes de mostrar o gráfico.');
    return;
  }

  const dadosAgrupados = agregadorPorCategoria();

  // Exibe canvas
  //canvasGrafico
  ctx.style.display = 'block';

  // Se já existir gráfico, destrói para recriar
  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(dadosAgrupados),
      datasets: [{
        label: 'Gastos',
        data: Object.values(dadosAgrupados),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { //é o texto mostrado no hover
          callbacks: {
            label: function(context) { //função anônima
              //O context é um objeto com informações sobre o ponto atual do gráfico (categoria, valor, índice etc.).
              let label = context.label || ''; //label OU vazio
              let value = context.parsed || 0; //parsed é o número que o Chart.js já entendeu do dado original.
              return label + ': R$ ' + value.toFixed(2);
            }
          }
        }
      }
    }
  });
});
