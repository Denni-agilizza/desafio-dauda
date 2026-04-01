const form = document.getElementById("form");
const lista = document.getElementById("lista");
const msg = document.getElementById("msg");
const contador = document.getElementById("contador");
const filtroSetor = document.getElementById("filtroSetor");

let inventarioCompleto = [];

async function carregar() {
  try {
    lista.innerHTML = `
      <tr>
        <td colspan="6" class="empty">Carregando inventário...</td>
      </tr>
    `;

    const res = await fetch("/api/inventario");
    const dados = await res.json();

    inventarioCompleto = Array.isArray(dados) ? dados : [];
    aplicarFiltro();
  } catch (error) {
    lista.innerHTML = `
      <tr>
        <td colspan="6" class="empty">Erro ao carregar inventário</td>
      </tr>
    `;
    contador.textContent = "0";
  }
}

function renderizarTabela(dados) {
  contador.textContent = dados.length;

  if (!dados.length) {
    lista.innerHTML = `
      <tr>
        <td colspan="6" class="empty">Nenhum equipamento cadastrado</td>
      </tr>
    `;
    return;
  }

  lista.innerHTML = dados
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td><span class="badge-tipo">${item.tipo}</span></td>
          <td>${item.modeloMarca}</td>
          <td>${item.colaborador}</td>
          <td>${item.setor}</td>
          <td>
            <button class="btn-delete" onclick="excluirItem(${item.id})">
              Excluir
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function mostrarMensagem(texto, tipo) {
  msg.innerText = texto;
  msg.style.color = tipo === "erro" ? "#f31260" : "#18c964";

  setTimeout(() => {
    msg.innerText = "";
  }, 3000);
}

function aplicarFiltro() {
  const termo = filtroSetor.value.trim().toLowerCase();

  const dadosFiltrados = inventarioCompleto.filter((item) =>
    item.setor.toLowerCase().includes(termo)
  );

  renderizarTabela(dadosFiltrados);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    id: document.getElementById("id").value,
    tipo: document.getElementById("tipo").value,
    modeloMarca: document.getElementById("modeloMarca").value,
    colaborador: document.getElementById("colaborador").value,
    setor: document.getElementById("setor").value
  };

  try {
    const res = await fetch("/api/inventario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarMensagem(data.message || "Erro ao cadastrar", "erro");
      return;
    }

    mostrarMensagem("Equipamento cadastrado com sucesso", "sucesso");
    form.reset();
    await carregar();
  } catch (error) {
    mostrarMensagem("Erro de conexão com o servidor", "erro");
  }
});

async function excluirItem(id) {
  const confirmar = confirm("Deseja realmente excluir este item?");

  if (!confirmar) {
    return;
  }

  try {
    const res = await fetch(`/api/inventario/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarMensagem(data.message || "Erro ao excluir item", "erro");
      return;
    }

    mostrarMensagem("Item excluído com sucesso", "sucesso");
    await carregar();
  } catch (error) {
    mostrarMensagem("Erro ao excluir item", "erro");
  }
}

filtroSetor.addEventListener("input", aplicarFiltro);

carregar();