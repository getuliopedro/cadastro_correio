const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cadastro.db");

let cadastros = [];

function criarTabela() {
  db.run(`
        CREATE TABLE IF NOT EXISTS cadastros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dataChegada TEXT,
            numeroCTE TEXT,
            nomeMotorista TEXT
        )
    `);
}

function cadastrarDados() {
  const dataChegada = document.getElementById("dataChegada").value;
  const numeroCTE = document.getElementById("numeroCTE").value;
  const nomeMotorista = document.getElementById("nomeMotorista").value;

  const novoCadastro = {
    "Data de Chegada": dataChegada,
    "Número do CTE": numeroCTE,
    "Nome do Motorista": nomeMotorista,
  };

  cadastros.push(novoCadastro);

  db.run(
    `
        INSERT INTO cadastros (dataChegada, numeroCTE, nomeMotorista)
        VALUES (?, ?, ?)
    `,
    [dataChegada, numeroCTE, nomeMotorista],
    (err) => {
      if (err) {
        console.error("Erro ao cadastrar no banco de dados:", err);
      } else {
        console.log("Dados cadastrados com sucesso.");
      }
    }
  );

  atualizarTabela();
  mostrarMenu(menuSaida);
}

function carregarDadosBanco() {
  db.all("SELECT * FROM cadastros", [], (err, rows) => {
    if (err) {
      console.error("Erro ao carregar dados do banco de dados:", err);
    } else {
      cadastros = rows;
      atualizarTabela();
    }
  });
}

function resetForm() {
  cadastroForm.reset();
}

function atualizarTabela() {
  const tbody = dadosTable.querySelector("tbody");
  tbody.innerHTML = "";

  cadastros.forEach((cadastro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${cadastro["Data de Chegada"]}</td>
            <td>${cadastro["Número do CTE"]}</td>
            <td>${cadastro["Nome do Motorista"]}</td>
        `;
    tbody.appendChild(tr);
  });
}

function mostrarMenu(menu) {
  menu.style.display = "block";
}

function ocultarMenu(menu) {
  menu.style.display = "none";
}

function main() {
  criarTabela();
  carregarDadosBanco();

  const cadastroForm = document.getElementById("cadastroForm");
  const dadosTable = document.getElementById("dadosTable");
  const menuSaida = document.getElementById("menuSaida");

  cadastroForm.addEventListener("submit", function (event) {
    event.preventDefault();
    cadastrarDados();
  });

  document
    .getElementById("novoDocumentoBtn")
    .addEventListener("click", function () {
      resetForm();
      ocultarMenu(menuSaida);
    });

  document.getElementById("sairBtn").addEventListener("click", function () {
    mostrarMenu(menuSair);
  });

  document.getElementById("salvarBtn").addEventListener("click", function () {
    console.log("Salvando dados...");
    // Implemente a lógica para salvar os dados se necessário
    resetForm();
    ocultarMenu(menuSair);
  });

  document
    .getElementById("gerarExcelBtn")
    .addEventListener("click", function () {
      console.log("Gerando arquivo Excel...");
      // Implemente a lógica para gerar o arquivo Excel se necessário
      resetForm();
      ocultarMenu(menuSair);
    });

  document
    .getElementById("exibirDadosBtn")
    .addEventListener("click", function () {
      console.log("\nDados Cadastrados:");
      cadastros.forEach((cadastro, index) => {
        console.log(`[${index + 1}]`);
        console.log(`  Data de Chegada: ${cadastro["Data de Chegada"]}`);
        console.log(`  Número do CTE: ${cadastro["Número do CTE"]}`);
        console.log(`  Nome do Motorista: ${cadastro["Nome do Motorista"]}`);
        console.log("------------------------");
      });

      const opcao = prompt(
        "Deseja salvar os dados em um arquivo Excel (S) ou apenas gerar (G)? "
      ).toUpperCase();

      if (opcao === "S") {
        console.log("Salvando dados...");
        // Implemente a lógica para salvar os dados se necessário
      } else if (opcao === "G") {
        console.log("Gerando arquivo Excel...");
        // Implemente a lógica para gerar o arquivo Excel se necessário
      } else {
        console.log("Opção inválida.");
      }

      resetForm();
      ocultarMenu(menuSair);
    });
}

main();
