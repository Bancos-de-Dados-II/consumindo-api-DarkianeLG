
const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const tipo = document.getElementById("tipo");
const btSalvar = document.getElementById("btSalvar");
const btListar = document.getElementById("btListar");

//FUNÇÃO SALVAR
btSalvar.addEventListener('click', function(){
    const task = {
        titulo: titulo.value,
        descricao: descricao.value,
        tipo: tipo.value 
    }

    fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    })
    titulo.value = "";
    descricao.value = "";
    tipo.value = "Pessoal"; 
});

//FUNÇÃO EXIBIR NA TELA
async function fetchTasks() {
    const response = await fetch("http://localhost:3000/tasks");
    const tasks = await response.json();

    const tabelaContainer = document.getElementById("lista-tarefas");
    tabelaContainer.innerHTML = ""; // limpa antes de adicionar outra tabela
    
    //Criando uma tabela
    const tabela = document.createElement("table");
    tabela.border = "1"; // Borda simples

    // Cabeçalho da tabela
    const cabecalho = tabela.insertRow();
    cabecalho.innerHTML = `
        <th>Título</th>
        <th>Descrição</th>
        <th>Tipo</th>
    `;

    // Linhas da tabela
    tasks.forEach(task => {
        const linha = tabela.insertRow();
        linha.innerHTML = `
            <td>${task.titulo}</td>
            <td>${task.descricao}</td>
            <td>${task.tipo}</td>
        `;
    });
    
    //Criando os botões de atualizar e remover 
    const botoes = document.getElementById("botoes");
    
    const btAtualizar = document.createElement("button");
    const btRemover = document.createElement("button");

    btAtualizar.textContent = "Remover";
    btRemover.textContent = "Atualizar"
    botoes.appendChild(btAtualizar);
    botoes.appendChild(btRemover);

    //Exebindo a tabela na tela
    tabelaContainer.appendChild(tabela);
}


btListar.addEventListener('click', fetchTasks);

