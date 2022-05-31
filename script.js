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
    console.log("clicou");
});


/*===================================================
        INICIANDO CONEXÃO COM BANCO 
===================================================*/
let db = firebase.firestore().collection("app").doc("homeApp");
let storage = firebase.storage().ref().child("app/homeApp")

//variavel para receber a imagem selecionada
let imagemSelecionada1;
let imagemSelecionada2;
let informativoDB;

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
    // compactarImagem(event, imagem, 1)

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
    //compactarImagem(event, imagem, 2)

})

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
    }
}