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
let protudoAlterar;
let produtoRemover;
let tabela = document.getElementById("tabelaProduto").getElementsByTagName("tbody")[0]
let keyLista = []


/*===================================================
        função que recupera os dados do banco
===================================================*/
//inicializando o banco de dados firebase
var db = firebase.firestore().collection("produtos");
let dbCategoria = firebase.firestore().collection("categorias");
let storage = firebase.storage().ref().child("produtos");
let categoriasIds = new Map()
let categoriasNomes = new Map()


/*==========================================================================
        funca de recuperar dados, CATEGORIAS  observa varias vez
==========================================================================*/
dbCategoria.onSnapshot(function(documentos) {

    //iniciando condição para percorrer os documentos da coleção 
    documentos.docChanges().forEach(function(changes) {

        //condicao para criar o crude
        if (changes.type === "added") {

            const doc = changes.doc
            const dados = doc.data()

            criarItensDropdown(dados)

        }
    });
})

/*==========================================================================
                funcao para criar itens da categoria 
==========================================================================*/

function criarItensDropdown(dados) {

    categoriasIds.set(dados.nome, dados.id)
    categoriasNomes.set(dados.id, dados.nome)

    //variavel que receber o Dorpdow
    const dropDown = document.getElementById("adicionarDropdown")
        //variavel que receber o altera Dorpdow
    const dropDownAlterar = document.getElementById("alterarDropdown")

    //variavel de opcao
    const option = document.createElement("OPTION")
    option.innerHTML = dados.nome

    const optionAlterar = document.createElement("OPTION")
    optionAlterar.innerHTML = dados.nome

    dropDown.options.add(option)
    dropDownAlterar.options.add(optionAlterar)

}


/*==========================================================================
        funca de recuperar dados, PRODUTOS observa varias vez
==========================================================================*/
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


/*===================================================
            funções criando botao tabela
===================================================*/
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

/*===================================================
                funções do modal
===================================================*/


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

    const categoria = document.getElementById("adicionarDropdown").value
    const categoria_id = categoriasIds.get(categoria)

    const descricao = document.getElementById("adicionarDescricao").value
    const possui_adicional = document.getElementById("adicionarRadioSim").checked


    //iniciando tratamento e validacao

    if (keyLista.indexOf(id) > -1) {

        abrirModalAlerta("ID já esta Cadastrado no Sistema")


    } else if (nome.trim() == "" || id.trim() == "" || valor.trim() == "" || descricao.trim() == "") {
        abrirModalAlerta("Preencha todos os Campos")


    } else if (imagemSelecionada == null) {
        abrirModalAlerta("INSIRA UMA IMAGEM")

    } else {

        //mostrando icone de carregamento 
        abrirProgressBar()

        //salvando dados no banco de dados
        //salvarDados(id, nome, "url")

        salvarImagemdb(id, nome, valor, categoria_id, descricao, possui_adicional)

        //limpando

    }
}

/*===================================================
             salvando dados no banco
===================================================*/
function salvarDados(id, nome, valor, categoria_id, descricao, possui_adicional, url) {
    const dados = {
        id: id,
        nome: nome,
        valor: valor,
        categoria_id: categoria_id,
        descricao: descricao,
        possui_adicional: possui_adicional,
        url: url
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
             salvando imagem no banco
===================================================*/
function salvarImagemdb(id, nome, valor, cantegoria_id, descricao, possui_adicional) {
    const imagem = id
    const upload = storage.child(imagem).put(imagemSelecionada)

    upload.on("state_changed", function(snapshot) {
        //funcção de medir o progresso do upload da imagem

    }, function(error) {
        //funcção de erro ao realizar o upload da imagem
        abrirModalAlerta("Error ao salvar imagem" + error)
        removerProgressBar()

    }, function() {
        //funcção de sucesso ao realizar o upload da imagem
        //recuperando url da imagem
        upload.snapshot.ref.getDownloadURL().then(function(url_imagem) {
            salvarDados(id, nome, valor, cantegoria_id, descricao, possui_adicional, url_imagem)
        })
    })
}


/*===================================================
             função add imagem no modal
===================================================*/
function clickAddImagem() {
    $('#imagemUploadAdicionar').click("show")
}

//pegando o elemento botão e observando o botao
$('#imagemUploadAdicionar').on("change", function(event) {
    //variavel que ira receber o elemento da modal
    const imagem = document.getElementById("imagemAdicionar")
        //src = "imagem/imagem.png"

    //camando função de compactar
    compactarImagem(event, imagem)

})


/*===================================================
             função alterar imagem  no modal
===================================================*/
// função alterar imagem no modal
function clickAlterImage() {
    $('#alterImagemUpload').click("show")

}


//pegando o elemento botão e observando o botao alterar
$('#alterImagemUpload').on("change", function(event) {
    //variavel que ira receber o elemento da modal
    const imagem = document.getElementById("alterImagem")
        //src = "imagem/imagem.png"


    //pegando o arqui selecionado pela janela e pegando o caminho da imagem
    //const imagemArq = event.target.files[0]
    const compress = new Compress()

    //camando função de compactar
    compactarImagem(event, imagem)

})


//compactando imagem
function compactarImagem(event, imagem) {

    //pegando o arqui selecionado pela janela e pegando o caminho da imagem
    //const imagemArq = event.target.files[0]
    const compress = new Compress()


    const files = [...event.target.files]
    compress.compress(files, {
        size: 4, // the max size in MB, defaults to 2MB
        quality: 0.75, // the quality of the image, max is 1,
        maxWidth: 1920, // the max width of the output image, defaults to 1920px
        maxHeight: 1920, // the max height of the output image, defaults to 1920px
        resize: true // defaults to true, set false if you do not want to resize the image width and height
    }).then((data) => {
        //condição para verificar se a data e diferente de nullo
        if (data[0] != null) {
            const image = data[0]
            const file = Compress.convertBase64ToFile(image.data, image.ext)
            imagemSelecionada = file

            //inserindo imagem
            inserirImagem(imagem, file)
        }

    })
}

//função de inserindo imagem
function inserirImagem(imagem, file) {
    imagem.file = file

    //iniciando condicao para validar o campo imagem
    if (imagemSelecionada != null) {

        //passa o caminho para ser armazenado
        const reader = new FileReader()

        reader.onload = (function(img) {
            return function(e) {
                img.src = e.target.result
            }
        })(imagem)

        //recuperando os dados 
        reader.readAsDataURL(file)
    }
}



/*===================================================
             função LIMPA CAMPOS DO  modal
===================================================*/
function limparCamposAdd() {
    //variavel que recebe os valores para serem limpos
    document.getElementById("adicionarID").value = ""
    document.getElementById("adicionarNome").value = ""
    document.getElementById("adicionarValor").value = ""
    document.getElementById("adicionarDescricao").value = ""
    document.getElementById("imagemAdicionar").src = "#"


    $("#imagemUploadAdicionar").val("")

    imagemSelecionada = null
}


/*===================================================
             função LIMPA CAMPOS DO  modal
===================================================*/
function limparCamposAlterar() {

    $("#alterImagemUpload").val("")

    imagemSelecionada = null
}


// função de alterar formulario modal 
function abrirModalAltera(dados) {
    $("#modalAlterar").modal("show")

    const id = document.getElementById("AlterID")
    const nome = document.getElementById("alterNome")
    const valor = document.getElementById("altererValor")
    const AlterarDrop = document.getElementById("alterarDropdown")
    const descricao = document.getElementById("alterarDescricao")
    const radioSim = document.getElementById("alterarRadioSim")
    const radioNao = document.getElementById("alterarRadioNao")
    const imagem = document.getElementById("alterImagem")



    id.innerText = dados.id
    nome.value = dados.nome
    valor.value = dados.valor
    AlterarDrop.value = categoriasNomes.get(dados.categoria_id)
    descricao.value = dados.descricao
    imagem.src = dados.url

    if (dados.possui_adicional == true) {

        radioSim.checked = true
    } else {
        radioNao.checked = true
    }


    protudoAlterar = dados

}


/*===================================================
             alterando  dados no banco fire base
===================================================*/
function alterarDadosFB(id, nome, valor, categoria_id, descricao, possui_adicional, url) {
    const dados = {
        id: id,
        nome: nome,
        valor: valor,
        categoria_id: categoria_id,
        descricao: descricao,
        possui_adicional: possui_adicional,
        url: url
    }


    db.doc(id).update(dados).then(function() {

        //fechando modal
        $("#modalAlterar").modal("hide")

        //fechando icone de carregamento 
        removerProgressBar()

        //limpando os campos
        limparCamposAlterar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Alterar Dados, Clieck em Fechar")

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
    const valor = document.getElementById("altererValor").value

    const categoria = document.getElementById("alterarDropdown").value
    const categoria_id = categoriasIds.get(categoria)

    const descricao = document.getElementById("alterarDescricao").value
    const possui_adicional = document.getElementById("alterarRadioSim").checked


    //condição para validar
    if (protudoAlterar.nome.trim() == nome.trim() && protudoAlterar.valor.trim() == valor.trim() &&
        protudoAlterar.categoria_id.trim() == categoria_id.trim() &&
        protudoAlterar.descricao.trim() == descricao.trim() && protudoAlterar.possui_adicional == possui_adicional &&
        imagemSelecionada == null) {
        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("nenhuma informação foi alterada")

    } else if (nome.trim() == "" || valor.trim() == "" || descricao.trim() == "") {

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("preencha o campo Obrigatorios ")

    } else if (imagemSelecionada != null) {
        //abrindo o progressebar
        abrirProgressBar()

        //funçao de alterar imagem
        altterarImagemdb(id, nome, valor, categoria_id, descricao, possui_adicional, )

    } else {

        //abrindo o progressebar
        abrirProgressBar()
            //funcao de alterando  fb
        alterarDadosFB(id, nome, valor, categoria_id, descricao, possui_adicional, protudoAlterar.url)
    }
}


/*===================================================
             alterando imagem no banco
===================================================*/
function altterarImagemdb(id, nome, valor, categoria_id, descricao, possui_adicional) {
    const imagem = id
    const upload = storage.child(imagem).put(imagemSelecionada)

    upload.on("state_changed", function(snapshot) {
        //funcção de medir o progresso do upload da imagem

    }, function(error) {
        //funcção de erro ao realizar o upload da imagem
        abrirModalAlerta("Error ao salvar imagem" + error)
        removerProgressBar()

    }, function() {
        //funcção de sucesso ao realizar o upload da imagem
        //recuperando url da imagem
        upload.snapshot.ref.getDownloadURL().then(function(url_imagem) {
            alterarDadosFB(id, nome, valor, categoria_id, descricao, possui_adicional, url_imagem)

        })
    })
}

/*===================================================
             função remover modal
===================================================*/
// função de alterar formulario modal 
function abrirModalRemover(dados) {
    $("#modalRemover").modal("show")

    produtoRemover = dados
}


/*===================================================
             função removendo dados  no modal
===================================================*/
// função remover click do botão
function RemoverProduto() {
    abrirProgressBar()
    removerImagemFb()

}


/*===================================================
             função removendo imagem fire bese
===================================================*/
// função remover 
function removerImagemFb() {

    const nomeImagem = produtoRemover.id
    const imagem = storage.child(nomeImagem)

    imagem.delete().then(function() {
        //Sucesso ao remover dados
        removerDadoFireBase()

    }).catch(function(error) {

        //Falha ao remover dados
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Erro ao Remover imagem " + error)
    })
}


/*===================================================
             função removendo Dados fire bese
===================================================*/
// função remover dados
function removerDadoFireBase() {

    const id = produtoRemover.id

    console.log(id)

    db.doc(id).delete().then(function() {

        //fechando modal
        $("#modalRemover").modal("hide")

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Remover Dados")

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
        //console.log("progressBar sendo chamada")

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
        $("#tabelaProduto tr:gt(0)").each(function() {

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


// ordenar por nome

//variavel de controle 
let ordemNome = false;

function ordenarNome() {

    //iniciando condição para ordenar crecente ou decrecente
    if (ordemNome) {
        //ordena em ordem decrecente
        ordemarItensNome()
        ordemNome = false

    } else {
        //ordena em ordem crecente
        ordemarItensNome()
        ordemNome = true
    }
}


// ordenar em ordem Crecente e Descrecente
function ordemarItensNome() {
    //variavl 
    let tr = tabela.getElementsByTagName('tr')

    //iniciando condiçõe para percorrer os dados da tabela

    for (let i = 0; i < tr.length - 1; i++) {

        for (let j = 0; j < tr.length - (i + 1); j++) {
            //variavel para receber a coluna
            let info1 = tr[j].getElementsByTagName("td")[1].textContent
            let info2 = tr[j + 1].getElementsByTagName("td")[1].textContent

            //realizando comparação entre as colunas
            if (info1 > info2 || info1 < info2) {
                tabela.insertBefore(tr.item(j + 1), tr.item(j))

                let valor = keyLista[j + 1]
                keyLista[j + 1] = keyLista[j]
                keyLista[j] = valor

            }
        }
    }
}