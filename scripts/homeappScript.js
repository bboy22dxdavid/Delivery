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



//variavel para instanciar o banco de dados
let db = firebase.firestore().collection("app").doc("homeApp");
let storage = firebase.storage().ref().child("app/homeApp")

//variavel para receber a imagem selecionada
let imagemSelecionada1;
let imagemSelecionada2;
let informativoDB;

/*==================================================
         OUVINTE DA TELA HOME APP
==================================================*/
firebase.firestore().collection("app").doc("homeApp").onSnapshot(function(documento) {
    //variavel que receberar os dados da colecao
    const dados = documento.data()

    //pegando imagens
    const imagem1 = document.getElementById("imagem1")
    const imagem2 = document.getElementById("imagem2")

    //mostrando a info na tela 
    const informativo = document.getElementById("informativo")

    informativoDB = dados.informativo
    imagem1.src = dados.url_imagem1
    imagem2.src = dados.url_imagem2
    informativo.value = dados.informativo

    //debugando codigo
    //console.log(dados.informativo)


})

/*===================================================
             FUNCAO ADD IMAGEM 1
===================================================*/
function clickAddImagem1() {
    $('#imagem1Upload').click()
        //console.log("imagem 1 selecionada")
}

//pegando o elemento botão e observando o botao
$('#imagem1Upload').on("change", function(event) {
    //variavel que ira receber o elemento da modal
    const imagem = document.getElementById("imagem1")
        //src = "imagem/imagem.png"

    //camando função de compactar
    compactarImagem(event, imagem, 1)

})

/*===================================================
             FUNCAO ADD IMAGEM 2
===================================================*/
function clickAddImagem2() {
    $('#imagem2Upload').click()
        //console.log("imagem 1 selecionada")
}




//pegando o elemento botão e observando o botao
$('#imagem2Upload').on("change", function(event) {
    //variavel que ira receber o elemento da modal
    const imagem = document.getElementById("imagem2")
        //src = "imagem/imagem.png"

    //camando função de compactar
    compactarImagem(event, imagem, 2)

})

/*===================================================
            compactando imagem
===================================================*/
function compactarImagem(event, imagem, opcao) {

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

            // condicao para verificar qual imagem foi selecionada
            if (opcao == 1) {

                imagemSelecionada1 = file

            } else {
                imagemSelecionada2 = file
            }


            //inserindo imagem
            inserirImagem(imagem, file)
        }

    })
}

/*===================================================
            função de inserindo imagem
===================================================*/
function inserirImagem(imagem, file) {
    imagem.file = file

    //iniciando condicao para validar o campo imagem
    if (file != null) {

        //passa o caminho para ser armazenado
        const reader = new FileReader()

        reader.onload = (function(img) {
            return function(e) {
                img.src = e.target.result
            }
        })(imagem)

        //recuperando os dados 
        reader.readAsDataURL(file)
            //console.log("compactando a imagem")
    }
}

/*================================
        VALIDANDO IMAGENS
 ================================*/
//VALIDANDO IMAGEM 1
function validarImagem1() {

    if (imagemSelecionada1 == null) {

        abrirModalAlerta("Imagem não foi Alterada ")
            //console.log("Imagem não foi alterada 1 ")

    } else {

        abrirProgressBar()
        const nome = "imagem1"
        salvarImagem1db(nome)
            //console.log("função que valida a imagem");
    }

}

/*===================================================
             salvando imagem 1 no banco
===================================================*/
function salvarImagem1db(nome) {
    const imagem = nome
    const upload = storage.child(imagem).put(imagemSelecionada1)

    upload.on("state_changed", function(snapshot) {
        //funcção de medir o progresso do upload da imagem

    }, function(error) {
        //funcção de erro ao realizar o upload da imagem
        abrirModalAlerta("Error ao Alterar Imagem" + error)
        removerProgressBar()
            //console.log("erro")

    }, function() {
        //funcção de sucesso ao realizar o upload da imagem
        //recuperando url da imagem

        upload.snapshot.ref.getDownloadURL().then(function(url_imagem) {
            salvarImagem1Banco(url_imagem)
                //console.log("sucesso" + url_imagem)

        })
    })
}

/*===================================================
             criando obj e  dados no banco
===================================================*/
function salvarImagem1Banco(url1) {
    const dados = {
        url_imagem1: url1
    }

    //console.log(dados)
    //db.collection("categorias").add(dados).then(function() 

    db.update(dados).then(function() {

        //fechando icone de carregamento 
        removerProgressBar()

        //limpando os campos
        limparCamposImagem1()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Alterar Imagem")
            // console.log("criando objoto imagem no banco")

    }).catch(function(error) {

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Erro ao Alterar Imagem" + error)
            // console.log("erro ao criando objoto imagem no banco")
    })

}

/*===================================================
             função LIMPA CAMPOS 1
===================================================*/
function limparCamposImagem1() {

    $("#imagem1Upload").val("")
    $("#imagem2Upload").val("")

    imagemSelecionada1 = null
    imagemSelecionada2 = null
}

//VALIDANDO IMAGEM 2
function validarImagem2() {

    if (imagemSelecionada2 == null) {

        abrirModalAlerta("Imagem não foi Alterada ")
            //console.log("Imagem não foi alterada 1 ")

    } else {

        abrirProgressBar()
        const nome = "imagem2"
        salvarImagem2db(nome)
    }
}

/*===================================================
             salvando imagem 2 no banco
===================================================*/
function salvarImagem2db(nome2) {
    const imagem2 = nome2
    const upload = storage.child(imagem2).put(imagemSelecionada2)

    upload.on("state_changed", function(snapshot) {
        //funcção de medir o progresso do upload da imagem

    }, function(error) {
        //funcção de erro ao realizar o upload da imagem
        abrirModalAlerta("Error ao Alterar Imagem" + error)
        removerProgressBar()
            //console.log("erro")

    }, function() {
        //funcção de sucesso ao realizar o upload da imagem
        //recuperando url da imagem

        upload.snapshot.ref.getDownloadURL().then(function(url_imagem2) {
            salvarImagem2Banco(url_imagem2)
                //console.log("sucesso"+ url_imagem)

        })
    })
}

/*===================================================
             criando obj e  dados no banco
===================================================*/
function salvarImagem2Banco(url2) {
    const dados = {
        url_imagem2: url2
    }

    //console.log(dados)
    //db.collection("categorias").add(dados).then(function() 

    db.update(dados).then(function() {

        //fechando icone de carregamento 
        removerProgressBar()

        //limpando os campos
        limparCamposImagem1()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Alterar Imagem")

    }).catch(function(error) {

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Erro ao Alterar Imagem" + error)
    })

}


/*================================
        ALTERANDO INFORMATIVO
 ================================*/
//alterando informativo
function validarInformativo() {
    const informativo = document.getElementById("informativo").value

    //iniciando condicao  para tratar o formulario
    if (informativo.trim() == "") {
        abrirModalAlerta("preencha o campo")

    } else if (informativoDB == informativo) {
        abrirModalAlerta("informações iguais, Informativo não foi alterados")
    } else {
        abrirProgressBar()
        salvarInfoBanco(informativo)

    }
}

/*===================================================
             criando obj e  dados no banco
===================================================*/
function salvarInfoBanco(informativo) {
    const dados = {
        informativo: informativo
    }

    console.log(dados)
        //db.collection("categorias").add(dados).then(function() 

    db.update(dados).then(function() {

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Sucesso ao Alterar Informativo")

    }).catch(function(error) {

        //fechando icone de carregamento 
        removerProgressBar()

        //exibindo a mensagem em forma da alerta
        abrirModalAlerta("Erro ao Alterar Imagem" + error)
    })

}

/*===================================================
                 funçãoa abrir progresseBar
===================================================*/
function abrirProgressBar() {
    //mostrando icone de carregamento 
    $("#modalProgresse").modal("show")
    console.log("abrindo progressBar sendo chamada")
}

/*================================
        fechar progresse bar
================================*/
function removerProgressBar() {
    //mostrando icone de carregamento 
    $("#modalProgresse").modal("hide")
    console.log("feichando progressBar sendo chamada")

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
    console.log("modal alerta")
    console.log(mensagem)
}