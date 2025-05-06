
const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const tipo = document.getElementById("tipo");
const btSalvar = document.getElementById("btSalvar");
const btListar = document.getElementById("btListar");
const btBuscar = document.getElementById("btBuscar");

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

//BUSCAR TODAS AS TAREFAS
async function buscarTodasAsTarefas() {
    const response = await fetch("http://localhost:3000/tasks");
    const tasks = await response.json();
    return tasks;
}

//FUNÇÃO EXIBIR NA Tabela
function exibirTarefasNaTabela(tasks, containerId = "lista-tarefas") {
    const tabelaContainer = document.getElementById(containerId);
    tabelaContainer.innerHTML = "";

    const tabela = document.createElement("table");
    tabela.border = "1";

    const cabecalho = tabela.insertRow();
    cabecalho.innerHTML = `
        <th>Título</th>
        <th>Descrição</th>
        <th>Tipo</th>
    `;

    tasks.forEach(task => {
        const linha = tabela.insertRow();
        linha.innerHTML = `
            <td>${task.titulo}</td>
            <td>${task.descricao}</td>
            <td>${task.tipo}</td>
        `;
    });

    tabelaContainer.appendChild(tabela);
}

// FUNÇÃO LISTAR TAREFAS
async function listar() {
    const tarefa = await buscarTodasAsTarefas();
    exibirTarefasNaTabela(tarefa);
        //Criando os botões de atualizar e remover 
        const botoes = document.getElementById("botoes");
    
        const btAtualizar = document.createElement("button");
        const btRemover = document.createElement("button");
    
        btAtualizar.textContent = "Remover";
        btRemover.textContent = "Atualizar"
        botoes.appendChild(btAtualizar);
        botoes.appendChild(btRemover);
}

btListar.addEventListener('click', listar);

// FUNÇÃO BUSCAR TAREFA
btBuscar.addEventListener('click', function () {
    const pesquisar = document.getElementById("pesquisar");
    pesquisar.innerHTML = ""; // Limpa o conteúdo anterior

    const label = document.createElement("label");
    label.textContent = "Buscar tarefa pelo título:";
    const input = document.createElement("input");
    input.type = "text";
    const btPesquisar = document.createElement("button");
    btPesquisar.textContent = "Buscar";

    pesquisar.appendChild(label);
    pesquisar.appendChild(input);
    pesquisar.appendChild(btPesquisar);

    btPesquisar.addEventListener('click', async function () {
        const tituloBusca = input.value.trim().toLowerCase();
        const resultado = document.getElementById("exibir-tarefa");
        resultado.innerHTML = "";

        if (tituloBusca === "") {
            resultado.textContent = "Informe o título da tarefa.";
            return;
        }

        const todasTarefas = await buscarTodasAsTarefas();
        const tarefasFiltradas = todasTarefas.filter(task =>
            task.titulo.toLowerCase().includes(tituloBusca)
        );

        if (tarefasFiltradas.length === 0) {
            resultado.textContent = "Nenhuma tarefa encontrada.";
        } else {
            exibirTarefasNaTabela(tarefasFiltradas, "exibir-tarefa");
        }
    });
});



