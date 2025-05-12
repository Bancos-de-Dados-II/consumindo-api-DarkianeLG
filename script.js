const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const tipo = document.getElementById("tipo");
let btSalvar = document.getElementById("btSalvar");
const btListar = document.getElementById("btListar");
const btBuscar = document.getElementById("btBuscar");
const mensagem = document.getElementById("mensagem");

// EXIBE MENSAGEM TEMPORARIA
function mostrarMensagem(texto, cor = "black") {
    mensagem.textContent = texto;
    mensagem.style.color = cor;

    setTimeout(() => {
        mensagem.textContent = "";
    }, 3000);
}

// LIMPA TODAS AS VISUALIZAÇÕES
function limparVisualizacoes() {
    document.getElementById("lista-tarefas").innerHTML = "";
    document.getElementById("exibir-tarefa").innerHTML = "";
    document.getElementById("pesquisar").innerHTML = "";
}

// REMOVE TODOS OS EVENT LISTENERS DE UM ELEMENTO 
function limparEventListeners(elemento) {
    const novoElemento = elemento.cloneNode(true);
    elemento.parentNode.replaceChild(novoElemento, elemento);
    return novoElemento;
}

// SALVAR TAREFA
btSalvar.addEventListener('click', function () {
    limparVisualizacoes();

    const task = {
        titulo: titulo.value,
        descricao: descricao.value,
        tipo: tipo.value
    };

    fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    })
        .then(response => {
            if (response.ok) {
                mostrarMensagem("Tarefa salva com sucesso!", "green");
                titulo.value = "";
                descricao.value = "";
                tipo.value = "Pessoal";
            } else {
                throw new Error("Erro ao salvar a tarefa");
            }
        })
        .catch(error => {
            console.error("Erro ao salvar:", error);
            mostrarMensagem("Erro ao salvar a tarefa!", "red");
        });
});

// BUSCAR TODAS AS TAREFAS
async function buscarTodasAsTarefas() {
    const response = await fetch("http://localhost:3000/tasks");
    const tasks = await response.json();
    return tasks;
}

// EXIBIR TABELA
function exibirTarefasNaTabela(tasks, containerId = "lista-tarefas") {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

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

    container.appendChild(tabela);
}

// LISTAR TAREFAS
btListar.addEventListener('click', async function () {
    limparVisualizacoes();
    buscarTodasAsTarefas().then(exibirTarefasNaTabela);
});

// BUSCAR TAREFA PELO TÍTULO
btBuscar.addEventListener('click', function () {
    limparVisualizacoes();

    const pesquisar = document.getElementById("pesquisar");

    const label = document.createElement("label");
    label.textContent = "Buscar tarefa pelo título:";
    const input = document.createElement("input");
    const btPesquisar = document.createElement("button");
    btPesquisar.textContent = "Buscar";

    pesquisar.appendChild(label);
    pesquisar.appendChild(input);
    pesquisar.appendChild(btPesquisar);

    btPesquisar.addEventListener('click', async function () {
        limparVisualizacoes();
        const tituloBusca = input.value.trim().toLowerCase();
        const resultado = document.getElementById("exibir-tarefa");

        if (tituloBusca === "") {
            resultado.textContent = "Informe o título da tarefa.";
            return;
        }

        const tarefas = await buscarTodasAsTarefas();
        const filtradas = tarefas.filter(task =>
            task.titulo.toLowerCase().includes(tituloBusca)
        );

        if (filtradas.length === 0) {
            resultado.textContent = "Nenhuma tarefa encontrada.";
        } else {
            exibirTarefasNaTabela(filtradas, "exibir-tarefa");
        }
    });
});

// ATUALIZAR TAREFA
function atualizarTarefa(task) {
    limparVisualizacoes();

    titulo.value = task.titulo;
    descricao.value = task.descricao;
    tipo.value = task.tipo;

    btSalvar = limparEventListeners(btSalvar);
    btSalvar.textContent = "Atualizar";

    btSalvar.addEventListener("click", function () {
        limparVisualizacoes();

        const tarefaAtualizada = {
            titulo: titulo.value,
            descricao: descricao.value,
            tipo: tipo.value
        };

        fetch(`http://localhost:3000/tasks/${task.firstName}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarefaAtualizada)
        })
            .then(response => {
                if (response.ok) {
                    mostrarMensagem("Tarefa atualizada com sucesso!", "green");
                    titulo.value = "";
                    descricao.value = "";
                    tipo.value = "Pessoal";
                    btSalvar.textContent = "Salvar";
                    buscarTodasAsTarefas().then(exibirTarefasNaTabela);
                } else {
                    throw new Error("Erro ao atualizar a tarefa");
                }
            })
            .catch(error => {
                console.error("Erro ao atualizar:", error);
                mostrarMensagem("Erro ao atualizar a tarefa!", "red");
            });
    });
}

// REMOVER TAREFA
function removerTarefa(id) {
    limparVisualizacoes();

    fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                mostrarMensagem("Tarefa removida com sucesso!", "green");
                buscarTodasAsTarefas().then(exibirTarefasNaTabela);
            } else {
                throw new Error("Erro ao remover a tarefa");
            }
        })
        .catch(error => {
            console.error("Erro ao remover:", error);
            mostrarMensagem("Erro ao remover a tarefa!", "red");
        });
}