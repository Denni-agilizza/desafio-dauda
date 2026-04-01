const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const INVENTARIO_PATH = path.join(__dirname, "inventario.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Ler inventário
function lerInventario() {
  try {
    if (!fs.existsSync(INVENTARIO_PATH)) {
      fs.writeFileSync(INVENTARIO_PATH, "[]", "utf-8");
    }

    const data = fs.readFileSync(INVENTARIO_PATH, "utf-8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler inventário:", error);
    return [];
  }
}

// Salvar inventário
function salvarInventario(dados) {
  fs.writeFileSync(
    INVENTARIO_PATH,
    JSON.stringify(dados, null, 2),
    "utf-8"
  );
}

// GET - listar itens
app.get("/api/inventario", (req, res) => {
  try {
    const inventario = lerInventario();
    res.status(200).json(inventario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar inventário" });
  }
});

// POST - cadastrar item
app.post("/api/inventario", (req, res) => {
  try {
    const { id, tipo, modeloMarca, colaborador, setor } = req.body;

    if (!tipo || !modeloMarca || !colaborador || !setor) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios"
      });
    }

    const inventario = lerInventario();

    let novoId = Number(id);

    if (!novoId || Number.isNaN(novoId)) {
      novoId = inventario.length
        ? Math.max(...inventario.map((item) => Number(item.id) || 0)) + 1
        : 1;
    }

    const idJaExiste = inventario.some(
      (item) => Number(item.id) === novoId
    );

    if (idJaExiste) {
      return res.status(409).json({
        message: "ID já existe"
      });
    }

    const novoItem = {
      id: novoId,
      tipo: String(tipo).trim(),
      modeloMarca: String(modeloMarca).trim(),
      colaborador: String(colaborador).trim(),
      setor: String(setor).trim()
    };

    inventario.push(novoItem);
    salvarInventario(inventario);

    return res.status(201).json({
      message: "Cadastrado com sucesso",
      item: novoItem
    });
  } catch (error) {
    console.error("Erro ao cadastrar item:", error);
    return res.status(500).json({
      message: "Erro interno ao cadastrar item"
    });
  }
});

// DELETE - excluir item
app.delete("/api/inventario/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const inventario = lerInventario();

    const index = inventario.findIndex(
      (item) => Number(item.id) === id
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Item não encontrado"
      });
    }

    inventario.splice(index, 1);
    salvarInventario(inventario);

    return res.status(200).json({
      message: "Item excluído com sucesso"
    });
  } catch (error) {
    console.error("Erro ao excluir item:", error);
    return res.status(500).json({
      message: "Erro interno ao excluir item"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Rodando em http://localhost:${PORT}`);
});