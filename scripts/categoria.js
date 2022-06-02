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
let imagemSelecionada;
let categoriaAlterar;
let categoriaRemover;
let tabela = document.getElementById("tabelaCategoria").getElementsByTagName("tbody")[0]
let keyLista = []

/*===================================================
        função que recupera os dados do banco
===================================================*/
//inicializando o banco de dados firebase
var db = firebase.firestore().collection("categorias");
let storage = firebase.storage().ref().child("categorias");

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

/*========================= TABELA =========================*/
/*===================================================
        função Adicioanr campos na Tabela
===================================================*/
//inserindo itens na tabela 
function criarItensTabela(dados) {

    const linha = tabela.insertRow()

    const colunaId = linha.insertCell(0)
    const colunaNome = linha.insertCell(1)
    const colunaAcao = linha.insertCell(2)

    const itemId = document.createTextNode(dados.id)
    const itemNome = document.createTextNode(dados.nome)


    colunaId.appendChild(itemId)
    colunaNome.appendChild(itemNome)

    criarButtonTabela(colunaAcao, dados)
        // ordemarItens()

}

/*===================================================
        funções criando botao tabela
===================================================*/
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

    //pegando coluna ios botoes
    const acoes = row.cells[2]

    //removendo coluna ios botoes
    acoes.remove()

    //inserindo coluna ios botoes
    const colunaAcao = row.insertCell(2)

    cellId.innerText = dados.id
    cellNome.innerText = dados.nome

    criarButtonTabela(colunaAcao, dados)

}

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

/*========================= funções do modal =========================*/


// funçãoabrir modal 
function abrirModal() {

    $('#modalAdicionar').modal("show")

}