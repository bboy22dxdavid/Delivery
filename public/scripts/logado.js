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
        window.alert("Deseja Deslogar?");
        console.log("Deseja Deslogar")
        window.location.href = "index.html"


    }).catch(function(error) {

        alert("Error ao Deslogado")

    })
}