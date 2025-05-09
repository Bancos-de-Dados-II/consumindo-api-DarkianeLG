
const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const tipo = document.getElementById("tipo");
const btSalvar = document.getElementById("btSalvar");
const btListar = document.getElementById("btListar");
const btBuscar = document.getElementById("btBuscar");
const mensagem = document.getElementById("mensagem");

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
        <th>Ações</th>
    `;

    tasks.forEach(task => {
        const linha = tabela.insertRow();
        linha.innerHTML = `
            <td>${task.titulo}</td>
            <td>${task.descricao}</td>
            <td>${task.tipo}</td>
        `;

        const celulaAcoes = linha.insertCell();

        const btAtualizar = document.createElement("button");
        btAtualizar.textContent = "Atualizar";
        btAtualizar.addEventListener("click", () => atualizarTarefa(task));
        
        const btRemover = document.createElement("button");
        btRemover.textContent = "Remover";
        btRemover.addEventListener("click", () => removerTarefa(task.firstName));
        
        celulaAcoes.appendChild(btAtualizar);
        celulaAcoes.appendChild(btRemover);
    });

    tabelaContainer.appendChild(tabela);
}

// FUNÇÃO LISTAR TAREFAS
async function listar() {
    const tarefa = await buscarTodasAsTarefas();
    exibirTarefasNaTabela(tarefa);
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

//FUNÇÃO ATUALIZAR
function atualizarTarefa(task) {
    titulo.value = task.titulo;
    descricao.value = task.descricao;
    tipo.value = task.tipo;

    // Clonar o botão para remover todos os listeners anteriores
    const novoBtSalvar = btSalvar.cloneNode(true);
    btSalvar.parentNode.replaceChild(novoBtSalvar, btSalvar);

    novoBtSalvar.textContent = "Atualizar";

    novoBtSalvar.addEventListener('click', function () {
        const tarefaAtualizada = {
            titulo: titulo.value,
            descricao: descricao.value,
            tipo: tipo.value
        };

        fetch(`http://localhost:3000/tasks/${task.firstName}`, { 
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tarefaAtualizada)
        })
        .then(response => {
            if (response.ok) {
                titulo.value = "";
                descricao.value = "";
                tipo.value = "Pessoal";
                novoBtSalvar.textContent = "Salvar";
                listar(); 
                mensagem.textContent = "Taarefa atualizada com sucesso!"

            } 
        })
        .catch(error => {
            console.error("Erro na requisição de atualização:", error);
            mensagem.textContent = "Erro ao atualizar a tarefa!"
        });
    });
}

//Função REMOVE
function removerTarefa(task){
    fetch(`http://localhost:3000/tasks/${task}`, { 
        method: "DELETE",
    })
    .then(()=> {
        listar();
        mensagem.textContent = "Taarefa removida com sucesso!"
    })
    .catch(error => {
        console.error("Erro ao remover a tarefa:", error);
        mensagem.textContent = "Erro ao remover a tarefa!"
    });
}


