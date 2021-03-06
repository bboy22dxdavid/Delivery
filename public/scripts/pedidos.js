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

let tabela = document.getElementById("tabelaPedido").getElementsByTagName("tbody")[0]


//inicializando o banco de dados firebase
var db = firebase.firestore().collection("pedidos");



//variavel global
let keyLista = []
let pedidoSelecionadoCliente;
let pedidoSelecionadoFinalizar;
let statusPedido;



//RERALIZANDO UMA CONSULTA COM QUERY  .where("status", "==", 1)
db.where("status", "<=", 3).onSnapshot(function(documentos) {

    //iniciando condição para percorrer os documentos da coleção 
    documentos.docChanges().forEach(function(changes) {

        //condicao para criar o crude
        if (changes.type === "added") {

            const doc = changes.doc
            const dados = doc.data()

            //pedidoSelecionadoFinalizar = dados //changes.doc.id
            statusPedido = dados.status

            keyLista.push(dados.IDpedido)


            //recuperando o uid do pedido
            //console.log(pedidoSelecionadoFinalizar);

            dados.data = new Date()

            //console.log(dados.data.toISOString());

            // console.log("dada e hora " + dados.data.toLocaleString());



            criarItensTabela(dados)

        } else if (changes.type === "modified") {
            const doc = changes.doc
            const dados = doc.data()

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

    const colunaClienteNome = linha.insertCell(0)
    const colunaPedidoNome = linha.insertCell(1)
    const colunaPedidoHora = linha.insertCell(2)


    const dados_pedidos = dados.produtos['0']['produto']['nome'].substr(0, 20) + "..."


    const itemClienteNome = document.createTextNode(dados.cliente)
    const itemPedidoDados = document.createTextNode(dados_pedidos.replace(/<br>/g, ""))
    const itemPedidodata = document.createTextNode(dados.data.toLocaleString())


    colunaClienteNome.appendChild(itemClienteNome)
    colunaPedidoNome.appendChild(itemPedidoDados)
    colunaPedidoHora.appendChild(itemPedidodata)
    criarButtonTabela(linha, dados)
    ordemarItens()

}





/*========================= função remover campos na Tabela =========================*/
/*===================================================
        função remover campos na Tabela
===================================================*/
//remover itens na tabela 
function removeItensTabela(dados) {

    //pegando a posição do item
    const index = keyLista.indexOf(dados.IDpedido)

    //removendo a linha da tabela
    tabela.rows[index].remove()

    //removendo o intem
    keyLista.splice(index, 1)

}




/*========================= funções criando botao tabela =========================*/
//criando botao
function criarButtonTabela(linha, dados) {

    //linha
    const colunaPedidoInf = linha.insertCell(3)
    const colunaClienteInf = linha.insertCell(4)
    const colunaPedidoImprimir = linha.insertCell(5)
    const colunaAtualizar = linha.insertCell(6)
    const colunaPedidoFinalizar = linha.insertCell(7)

    //inserindo botoes
    const buttondetalhePedido = document.createElement("button")
    buttondetalhePedido.innerHTML = `<span class="material-symbols-outlined">visibility</span>`
    buttondetalhePedido.className = "btn btn-primary  btn-xs"

    const buttonDetalheCliente = document.createElement("button")
    buttonDetalheCliente.innerHTML = `<span class="material-symbols-outlined">info</span>`
    buttonDetalheCliente.className = "btn btn-warning btn-xs"

    const buttonIprimir = document.createElement("button")
    buttonIprimir.innerHTML = `<span class="material-symbols-outlined">print</span>`
    buttonIprimir.className = "btn btn-secondary btn-xs"

    const buttonAtualizar = document.createElement("button")
    buttonAtualizar.innerHTML = `<span class="material-symbols-outlined">sync_alt</span>`
    buttonAtualizar.className = "btn btn-info btn-xs"

    const buttonFinalizar = document.createElement("button")
    buttonFinalizar.innerHTML = `<span class="material-symbols-outlined">task_alt</span>`
    buttonFinalizar.className = "btn  btn-success btn-xs"


    //evento do botão
    buttondetalhePedido.onclick = function() {
        //debugando console.log("buttondetalhePedido")
        clickDetalhePedido(dados)
        return false
    }

    buttonDetalheCliente.onclick = function() {
        //debugando console.log(" buttonDetalheCliente")

        clickDetalheCliente(dados)
        return false
    }

    buttonIprimir.onclick = function() {
        //debugando console.log(" buttonIprimir ")
        clickImprimir(dados)
        return false
    }

    buttonAtualizar.onclick = function() {
        //debugandoconsole.log(" primeira ação do btn")

        clickAtualizar(dados)
        return false
    }

    buttonFinalizar.onclick = function() {
        //debugandoconsole.log(" primeira ação do btn")

        clickFinalizar(dados)
        return false
    }

    colunaPedidoInf.appendChild(buttondetalhePedido)
    colunaClienteInf.appendChild(buttonDetalheCliente)
    colunaPedidoImprimir.appendChild(buttonIprimir)
    colunaAtualizar.appendChild(buttonAtualizar)
    colunaPedidoFinalizar.appendChild(buttonFinalizar)

}






/*====================================================== 
            EVENTO DO BOTÃO DETALHES DO PEDIDO
====================================================== */

function clickDetalhePedido(dados) {
    //CHAMANDO A MODAL  
    $("#modalPedido").modal("show")

    //variaveis da modal
    const idCliente = document.getElementById("idCliente")
    const pedido_dados = document.getElementById("desconto")
    const pedido_pagametno = document.getElementById("pagamento")
    const pedido_data = document.getElementById("status")

    idCliente.innerHTML = dados.idCliente
    pedido_dados.innerHTML = dados.produtos['0']['produto']['nome']
    pedido_pagametno.innerHTML = dados.pagamento
    pedido_data.innerHTML = dados.data.toLocaleString()

}




/*====================================================== 
        EVENTO DO BOTÃO DETALHES DO CLIENTE
====================================================== */
function clickDetalheCliente(dados) {
    //CHAMANDO A MODAL 
    $("#modalCliente").modal("show")

    //variaveis da modal
    const nome = document.getElementById("clienteNome")
    const endereco = document.getElementById("clienteEndereco")
    const contato = document.getElementById("clienteEContato")

    nome.innerHTML = dados.cliente
    endereco.innerHTML = dados.endereco
    contato.innerHTML = dados.telefone


    pedidoSelecionadoCliente = dados


}



/*====================================================== 
        EVENTO DO BOTÃO DE IMPRIR
====================================================== */
function clickImprimir(dados) {
    //consfiguraçao da variavel de impressao
    const doc = new jsPDF("landscape", "mm", [397, 310])

    doc.setFont("helvetica")
    doc.setFontStyle("bold")
    doc.setFontSize(11)

    //doc.text("Pedido Nº: " + dados.appId, 20, 5)
    doc.text("Data e Hora Pedido:  " + dados.data.toLocaleString(), 20, 20)
    doc.text("\nCliente:  " + dados.cliente, 20, 25)
    doc.text("Forma de Pagamento:  " + dados.pagamento, 20, 40)
    doc.text("\nValor Total:  " + dados.total, 20, 55)
    doc.text("Pedido: " + dados.produtos['0']['produto']['nome'].replace(/<br>/g, "\n"), 20, 70)
    doc.text("\n Endereço do Cliente:  " + dados.endereco, 20, 80)
    doc.text("\n telefone:  " + dados.telefone, 20, 100)


    //imprimindo os dados
    doc.autoPrint()
    doc.output("dataurlnewwindow")

}





/*====================================================== 
        EVENTO DO BOTÃO DE FINALIZAR PEDIDO
====================================================== */
function clickFinalizar(dados) {
    //CHAMANDO A MODAL  
    $("#modalFinalizar").modal("show")
        //console.log("clique para finalizar" + dados.status)


    pedidoSelecionadoFinalizar = dados
        //console.log("clickFinalizar" + pedidoSelecionadoFinalizar)
}





/*====================================================== 
        EVENTO DO BOTÃO "SIM" FINALIZAR PEDIDO
====================================================== */
function finalizarPedido() {

    //console.log("finalizarPedido  " + pedidoSelecionadoFinalizar.IDpedido)
    const dado = {
        status: 4
    }


    //pegando o caminho do banco de dados
    firebase.firestore().collection("pedidos").doc(pedidoSelecionadoFinalizar.IDpedido).update(dado).then(function() {

        //ESCONDENDO A MODAL  
        $("#modalFinalizar").modal("hide")
        abrirModalAlerta("Pedido Finalizado com Sucesso!")
            //console.log("Pedido Alterado para Transporte")

    }).catch(function(error) {
        abrirModalAlerta("Error ao Finalizar Pedido" + error)
            //console.log("Sucesso ao Finalizar Pedido erro" + error)

    })
}


/*====================================================== 
        EVENTO DO BOTÃO DE FINALIZAR PEDIDO
====================================================== */
function clickAtualizar(dados) {
    //CHAMANDO A MODAL  
    $("#modalAtualizar").modal("show")
        //console.log("clique para finalizar" + dados.status)


    pedidoSelecionadoFinalizar = dados
        //console.log("clickFinalizar" + pedidoSelecionadoFinalizar)
}


/*====================================================== 
        EVENTO DO BOTÃO "SIM" FINALIZAR PEDIDO
====================================================== */
function atualizarPedido() {
    //console.log(" inicio da função " + pedidoSelecionadoFinalizar.IDpedido)
    //vaiavel que recebera o obj do pedido
    var status = statusPedido
        //console.log("finalizarPedido" + status)
    if (status <= 1) {
        const dado = {
            status: 2
        }

        //console.log("primeiro if status = 1  " + pedidoSelecionadoFinalizar.IDpedido)
        //console.log("valor do status " + status)

        //pegando o caminho do banco de dados
        firebase.firestore().collection("pedidos").doc(pedidoSelecionadoFinalizar.IDpedido).update(dado).then(function() {

            //fechando modal
            $("#modalAtualizar").modal("hide")
            abrirModalAlerta("Pedido Alterado para Transporte!")
                //console.log("Pedido Alterado para Transporte")
            setTimeout(function() {
                location.reload(1);
            }, 2000);
        }).catch(function(error) {
            abrirModalAlerta("Error ao Finalizar Pedido" + error)
                //console.log("Sucesso ao Finalizar Pedido erro" + error)
        })

    } else if (status == 2) {
        const dado = {
            status: 3
        }

        //console.log("segundo if status = 2  " + pedidoSelecionadoFinalizar.IDpedido)
        // console.log("valor do status " + status)

        //pegando o caminho do banco de dados
        firebase.firestore().collection("pedidos").doc(pedidoSelecionadoFinalizar.IDpedido).update(dado).then(function() {

            //fechando modal
            $("#modalAtualizar").modal("hide")
            abrirModalAlerta("Pedido Alterado para Entrege!")
                //console.log("Pedido Alterado para Transporte")
            setTimeout(function() { location.reload(1); }, 2000);

        }).catch(function(error) {
            abrirModalAlerta("Error ao Finalizar Pedido" + error)
                //console.log("Sucesso ao Finalizar Pedido erro" + error)
        })




    } else if (status == 3) {

        // console.log("pronto para finalizar  if status =3  " + pedidoSelecionadoFinalizar.IDpedido)
        //console.log("valor do status " + status)
        //fechando modal
        $("#modalAtualizar").modal("hide")
        abrirModalAlerta("Pedido Pronto para ser finalizado no sistema!")
            //console.log("Pedido Pronto para ser finalizado no sistema!")
        setTimeout(function() { location.reload(1); }, 2000);

    } else {
        //console.log("Falha ao alterar Status do Pedido" + pedidoSelecionadoFinalizar.IDpedido)
        //fechando modal
        $("#modalAtualizar").modal("hide")
        abrirModalAlerta("Falha ao alterar Status do Pedido!")
        setTimeout(function() { location.reload(1); }, 2000);
    }
}



/*===================================================
             função LIMPA CAMPOS 1
===================================================*/
function limparCampos() {

    document.getElementById("clienteTituloNotific").value = ""
    document.getElementById("clienteMensagemNotific").value = ""
}



/*===================================================
                 funçãoabrir abrir progresseBar
===================================================*/
function abrirProgressBar() {
    //mostrando icone de carregamento 
    $("#modalProgresse").modal("show")

}




/*===================================================
             função alerta  no modal
===================================================*/

function abrirModalAlerta(mensagem) {

    //exibindo a mensagem em forma da alerta
    $("#modalAlert").modal("show")
    document.getElementById("alertaMenssagem").innerText = mensagem

}




/*================================
        fechar progresse bar
================================*/
function removerProgressBar() {
    //mostrando icone de carregamento 
    $("#modalProgresse").modal("hide")
    console.log("progressBar sendo chamada")

    //erro nesta função
    /*window.setTimeout(function() {
        document.getElementById("modalProgress").click()
    }, 500)*/

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
        $("#tabelaPedido tr:gt(0)").each(function() {

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
            let info1 = tr[j].getElementsByTagName("td")[2].textContent
            let info2 = tr[j + 1].getElementsByTagName("td")[2].textContent

            //realizando comparação entre as colunas
            if (Number(info1.replace(/[^0-9\.]+/g, "")) < Number(info2.replace(/[^0-9\.]+/g, ""))) {
                tabela.insertBefore(tr.item(j + 1), tr.item(j))

                let valor = keyLista[j + 1]
                keyLista[j + 1] = keyLista[j]
                keyLista[j] = valor

            }
        }
    }
}