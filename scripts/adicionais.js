/*===================================================
             CONFIGURAÇÕES DO MENU 
===================================================*/

const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch");

//funcao que feicha o menu
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

//funcao que feicha o sub-menu
$('.seta').click(function() {
    $('.sidebar li .sub-menu').toggleClass('mostra');
    //console.log("clicou");
});


/*===================================================
        INICIANDO CONEXÃO COM BANCO 
===================================================*/
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyABSx21OLbwTmNYQoLSwnX4VLUYEPDbttw",
    authDomain: "delivery-b8657.firebaseapp.com",
    projectId: "delivery-b8657",
    storageBucket: "delivery-b8657.appspot.com",
    messagingSenderId: "800540584691",
    appId: "1:800540584691:web:90b566462e8abab209a586",
    measurementId: "G-ZCYQSHS8EG"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//variavel global
let adicionalAlterar;
let adicionalRemover;
let tabela = document.getElementById("tabelaAdicional").getElementsByTagName("tbody")[0]
let keyLista = []

/*===================================================
        função que recupera os dados do banco
===================================================*/
//inicializando o banco de dados firebase
var db = firebase.firestore().collection("adicionais");

//funca de recuperar dados, childEventeListener observa varias vez
db.onSnapshot(function(documentos) {

    //iniciando condição para percorrer os documentos da coleção 
    documentos.docChanges().forEach(function(changes) {

        //condicao para criar o crude
        if (changes.type === "added") {

            const doc = changes.doc
            const dados = doc.data()

            keyLista.push(dados.id)

            criarItensTabela(dados)


        } else if (changes.type === "modified") {
            const doc = changes.doc
            const dados = doc.data()

            alterarItensTabela(dados)

        } else if (changes.type === "removed") {

            const doc = changes.doc
            const dados = doc.data()

            removeItensTabela(dados)

        }

    });
})


/*========================= adicionando itnes na tabela =========================*/

/*===================================================
        função Adicioanr campos na Tabela
===================================================*/
//inserindo itens na tabela 
function criarItensTabela(dados) {

    const linha = tabela.insertRow()

    const colunaId = linha.insertCell(0)
    const colunaNome = linha.insertCell(1)
    const colunaValor = linha.insertCell(2)
    const colunaAcao = linha.insertCell(3)

    const itemId = document.createTextNode(dados.id)
    const itemNome = document.createTextNode(dados.nome)
    const itemValor = document.createTextNode(dados.valor)


    colunaId.appendChild(itemId)
    colunaNome.appendChild(itemNome)
    colunaValor.appendChild(itemValor)

    criarButtonTabela(colunaAcao, dados)
        // ordemarItens()

}


/*========================= função alterar campos na Tabela =========================*/
/*===================================================
        função alterar campos na Tabela
===================================================*/
//altera itens na tabela 
function alterarItensTabela(dados) {
    //pegando a posicao da variavel que foi alterado
    const index = keyLista.indexOf(dados.id)
    const row = tabela.rows[index]

    //pegando a coluna ID
    const cellId = row.cells[0]

    //pegando coluna nome
    const cellNome = row.cells[1]

    //pegando coluna valor
    const cellValor = row.cells[2]

    //pegando coluna ios botoes
    const acoes = row.cells[3]

    //removendo coluna ios botoes
    acoes.remove()

    //inserindo coluna ios botoes
    const colunaAcao = row.insertCell(3)

    cellId.innerText = dados.id
    cellNome.innerText = dados.nome
    cellValor.innerText = dados.valor

    criarButtonTabela(colunaAcao, dados)

}


/*========================= função remover campos na Tabela =========================*/
/*===================================================
        função remover campos na Tabela
===================================================*/
//remover itens na tabela 
function removeItensTabela(dados) {

    //pegando a posição do item
    const index = keyLista.indexOf(dados.id)

    //removendo a linha da tabela
    tabela.rows[index].remove()

    //removendo o intem
    keyLista.splice(index, 1)

}


/*========================= funções criando botao tabela =========================*/
//criando botao
function criarButtonTabela(colunaAcao, dados) {
    //inserindo botoes
    const buttonAlerar = document.createElement("button")
    buttonAlerar.innerHTML = `<span class="material-symbols-outlined">edit</span>`
    buttonAlerar.className = "btn btn-success btn-xs"

    const buttonRemover = document.createElement("button")
    buttonRemover.innerHTML = `<span class="material-symbols-outlined">delete</span>`
    buttonRemover.className = "btn btn-danger btn-xs"

    //evento do botão
    buttonAlerar.onclick = function() {
        abrirModalAltera(dados)
        return false
    }

    buttonRemover.onclick = function() {
        abrirModalRemover(dados)
        return false
    }

    colunaAcao.appendChild(buttonAlerar)
    colunaAcao.appendChild(document.createTextNode(" "))
    colunaAcao.appendChild(buttonRemover)

}






/*========================= funções do adicionar modal =========================*/


// funçãoabrir modal 
function abrirModal() {

    $('#modalAdicionar').modal("show")

}


/*===================================================
             função add Dados modal
===================================================*/
// função de add formulario modal 
function buttonAdicionarCampos() {

    //variavel que recebe os valores
    const id = document.getElementById("adicionarID").value
    const nome = document.getElementById("adicionarNome").value
    const valor = document.getElementById("adicionarValor").value

    //const imagem = document.getElementById("imagemUploadAdicionar").value

    //iniciando tratamento e validacao
    if (keyLista.indexOf(id) > -1) {

        abrirModalAlerta("ID já esta Cadastrado no Sistema")


    } else if (nome.trim() == "" || id.trim() == "" || valor.trim() == "") {
        abrirModalAlerta("Preencha todos os Campos")


    } else {

        //mostrando icone de carregamento 
        abrirProgressBar()

        //salvando dados no banco de dados
        salvarDados(id, nome, valor)

        //limpando

    }
}

/*===================================================
             salvando dados no banco
===================================================*/
function salvarDados(id, nome, valor) {
    const dados = {
        id: id,
        nome: nome,
        valor: valor
    }

    db.doc(id).set(dados).then(function() {

        //fechando icone de carregamento 
        removerProgressBar()

        //limpando os campos
        limparCamposAdd()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Salvar Dados")

    }).catch(function(error) {

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Erro ao Salvar Dados" + error)
    })

}




/*===================================================
             função LIMPA CAMPOS DO  modal
===================================================*/
function limparCamposAdd() {
    //variavel que recebe os valores para serem limpos
    document.getElementById("adicionarID").value = ""
    document.getElementById("adicionarNome").value = ""
    document.getElementById("adicionarValor").value = ""
}



/*========================= funções alterar modal =========================*/

/*===================================================
             função alterar  modal
===================================================*/
// função de alterar formulario modal 
function abrirModalAltera(dados) {
    $("#modalAlterar").modal("show")

    const id = document.getElementById("AlterID")
    const nome = document.getElementById("alterNome")
    const valor = document.getElementById("alterarValor")


    id.innerText = dados.id
    nome.value = dados.nome
    valor.value = dados.valor

    adicionalAlterar = dados

}



/*===================================================
             alterando  dados no banco fire base
===================================================*/
function alterarDadosFB(id, nome, valor) {
    const dados = {
        id: id,
        nome: nome,
        valor: valor
    }

    db.doc(id).update(dados).then(function() {

        //fechando modal
        $("#modalAlterar").modal("hide")


        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Alterar Dados, click em OK")

        //fechando icone de carregamento 
        removerProgressBar()
    }).catch(function(error) {

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Erro ao Alterar Dados" + error)
    })

}



/*===================================================
             função alterar dados  no modal
===================================================*/
// função de alterar formulario modal 
function buttonAlterCampos() {

    //variaveis
    const id = document.getElementById("AlterID").innerHTML
    const nome = document.getElementById("alterNome").value
    const valor = document.getElementById("alterarValor").value



    //condição para validar
    if (adicionalAlterar.nome.trim() == nome.trim() && adicionalAlterar.valor.trim() == valor.trim()) {
        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("nenhuma informação foi alterada")

    } else if (nome.trim() == "" || valor.trim() == "") {

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("preencha o campo")

    } else {

        //abrindo o progressebar
        abrirProgressBar()
            //funcao de alterando  fb
        alterarDadosFB(id, nome, valor)
    }
}





/*===================================================
             função remover modal
===================================================*/
// função de alterar formulario modal 
function abrirModalRemover(dados) {
    $("#modalRemover").modal("show")

    adicionalRemover = dados
}




/*===================================================
             função removendo dados  no modal
===================================================*/
// função remover click do botão
function RemoverAdicional() {
    abrirProgressBar()
    removerDadoFireBase()
}




/*===================================================
             função removendo Dados fire bese
===================================================*/
// função remover dados
function removerDadoFireBase() {

    const id = adicionalRemover.id

    console.log(id)

    db.doc(id).delete().then(function() {

        //fechando modal
        $("#modalRemover").modal("hide")

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Remover Dados, Click em Fechar")

    }).catch(function(error) {

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Erro ao Remover Dados" + error)
    })
}




/*===================================================
             função de progresse bar
===================================================*/
//abrir progresseBar
function abrirProgressBar() {
    //mostrando icone de carregamento 
    $("#modalProgresse").modal("show")

}




//fechar progresse bar
function removerProgressBar() {
    //mostrando icone de carregamento 
    $("#modalProgresse").modal("hide")

    //erro nesta função
    /*window.setTimeout(function() {
        document.getElementById("modalProgress").click()
    }, 500)*/

}


/*===================================================
             função alerta  no modal
===================================================*/

function abrirModalAlerta(mensagem) {

    //exibindo a mensagem em forma da alerta
    $("#modalAlert").modal("show")
    document.getElementById("alertaMenssagem").innerText = mensagem

}



/*========================= funções da tabela =========================

/*===================================================
             função de Pesquisar 
===================================================*/
// Busca registro 

function pesquisar(opcao) {
    //variaveis 

    let inputValor, filtro, tr, td, i, valorItemTabela;

    inputValor = document.getElementById("pesquisar" + opcao).value;
    filtro = inputValor.toUpperCase()
    tr = tabela.getElementsByTagName("tr")

    //condicao para verificar conteudo da pesquisa 
    for (i = 0; i < tr.length; i++) {

        td = tr[i].getElementsByTagName("td")[opcao]

        //pegando o valor do item na tabela 
        if (td) {

            valorItemTabela = td.textContent.toUpperCase()

            if (valorItemTabela.indexOf(filtro) == -1) {

                tr[i].style.display = "none"
            } else {

                tr[i].style.display = ""
            }
        }
    }

}





/*===================================================
    função de mostra quatidade de registros
===================================================*/
// observando funcao

$("#maxRows").on("change", function() {

    //variavel
    let maxRows, tr, i;

    //variavel que verifica o valor do usuario excolheu 
    maxRows = parseInt($("#maxRows").val()) - 1

    tr = tabela.getElementsByTagName("tr")

    //condicao para verificar conteudo da pesquisa 
    for (i = 0; i < tr.length; i++) {
        if (i > maxRows) {
            tr[i].style.display = "none"
        } else {
            tr[i].style.display = ""
        }
    }

    //vaiaveis de paginacao
    let rows = maxRows + 1
    let totalRows = tr.length

    //zerando a paginaçao
    $("#paginacao").html("")

    //iniciando condicao para verificar a quantidade de linhas da tabela
    if (totalRows > rows) {
        //variavel numero de paginas
        let numpage = Math.ceil(totalRows / rows)

        //condicao para add as paginacao
        for (let i = 1; i <= numpage; i++) {
            $("#paginacao").append(' <li class="page-item"><a class="page-link" href="#">' + i + '</a></li>').show()

        }
    }

    //paginacao click
    $("#paginacao").on("click", function(e) {

        let numpage = parseInt(e.target.innerText)


        i = 1

        //percorendo os itens da tabela
        $("#tabelaAdicional tr:gt(0)").each(function() {

            if (i > (rows * numpage) || i <= ((rows * numpage) - rows)) {

                $(this).hide()
            } else {

                $(this).show()
            }

            i++;
        })
    })
})



/*===================================================
             função de ordenar por ID 
===================================================*/
// ordenar por ID 

//variavel de controle 
let ordem = true;

function ordenarId() {

    //iniciando condição para ordenar crecente ou decrecente
    if (ordem) {
        //ordena em ordem decrecente
        ordemarItens()
        ordem = false

    } else {
        //ordena em ordem crecente
        ordemarItens()
        ordem = true
    }
}


// ordenar em ordem Crecente e Descrecente
function ordemarItens() {
    //variavl 
    let tr = tabela.getElementsByTagName('tr')

    //iniciando condiçõe para percorrer os dados da tabela

    for (let i = 0; i < tr.length - 1; i++) {

        for (let j = 0; j < tr.length - (i + 1); j++) {
            //variavel para receber a coluna
            let info1 = tr[j].getElementsByTagName("td")[0].textContent
            let info2 = tr[j + 1].getElementsByTagName("td")[0].textContent

            //realizando comparação entre as colunas
            if (Number(info1) < Number(info2) || Number(info1) > Number(info2)) {
                tabela.insertBefore(tr.item(j + 1), tr.item(j))

                let valor = keyLista[j + 1]
                keyLista[j + 1] = keyLista[j]
                keyLista[j] = valor

            }
        }
    }
}