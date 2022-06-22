window.onload = function() {

    firebase.auth().onAuthStateChanged(function(user) {

        //condcao para verificar se existe usuario
        if (user) {

        } else {

            alert("Usuario Não esta Logado")
            window.location.href = "index.html"
        }
    })
}



function deslogando() {
    //deslogando gando não for usuario admim
    firebase.auth().signOut().then(function() {

        window.location.href = "index.html"
        alert("Usuario Deslogado")

    }).catch(function(error) {

        alert("Error ao Deslogado")

    })
}