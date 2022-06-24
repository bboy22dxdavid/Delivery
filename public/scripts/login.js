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
/*==============================================
        FUNCAO QUE RECEBE OS DADOS DO HTM 
==============================================*/
function login() {
    //variaveis de armazenamento 
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value

    //console.log("email: " + email)

    //iniciando as condicoes para validar os campos 
    if (email.trim() == "" || senha.trim() == "") {

        abrirModalAlerta("Todos campos Devem ser preenchido Obrigatoriamente")

    } else {

        loginFirebase(email, senha)

    }
}




/*==============================================
        FUNCAO QUE FAZ O LOGIN NO FIREBASE
==============================================*/
function loginFirebase(email, senha) {

    firebase.auth().signInWithEmailAndPassword(email, senha).then(function() {

        console.log("iniciando a funcao de login")
        confirmaAdmin()

    }).catch(function(error) {
        console.log(error.message)
        let errorMessage = error.message;

        //console.log("Error"+ errorMessage)
        errorFirebase(errorMessage)

    });
}






/*===================================================
        FUNCAO QUE VALIDA SE USER E ADMIM
=====================================================*/
function confirmaAdmin() {

    abrirProgressBar()

    //pegando dados do usuario
    firebase.firestore().collection("web").doc("admin").get().then(function(doc) {

        removerProgressBar()
            // console.log("usuario e admin")
        window.location.href = "pedidos.html"

    }).catch(function(error) {

        removerProgressBar()
            //deslogando gando não for usuario admim
        firebase.auth().signOut()

        const errorMesagem = error.mensagem
        errorFirebase(errorMesagem)
    })

}



/*=========================================================================
        FUNCAO QUE VALIDA E FAZ TRATAMENTO DE ERROVINDO DO BANCO 
============================================================================*/
function errorFirebase(erro) {


    //iniciando as condicao para verificar os erro retornando do banco
    if (erro.includes("The password is invalid or the user does not have a password")) {

        abrirModalAlerta("senha invalida")

    } else if (erro.includes("There is no user record corresponding to this identifier")) {

        abrirModalAlerta("E-mail não cadastrado")

    } else if (erro.includes("E-mail address is badly")) {

        abrirModalAlerta("Esse e-mail não e valido")

    } else if (erro.includes("insufficient permissions")) {

        abrirModalAlerta("Usuario não Autorizado")

    } else {

        abrirModalAlerta(erro)
    }
}







/*===================================================
             REVELAR E OCULTAR SENHA
===================================================*/
function revelarSenha() {
    //variavel
    const senha = document.getElementById("senha")
    const revelar = document.getElementById("imgRevelar")

    //condicao
    if (senha.type == "password") {
        senha.type = "text"

        revelar.setAttribute("class", "fas fa-eye-slash")

    } else {
        senha.type = "password"
        revelar.setAttribute("class", "fas fa-eye")
    }
}


/*===================================================
             SALTANDO OS CAMPOS
===================================================*/

function proximoInput(id, evento) {

    //condicao para verificar a tecla presionada
    if (evento.keyCode == 13) {

        document.getElementById(id).focus()
    }
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
    console.log("progressBar sendo chamada")

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