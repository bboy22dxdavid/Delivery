

//AUMENTANDO O TAMANHO DA MEMORIA CACH
firebase.firestore().settings({
    cacheSizeBytes: 10485760
});


//INICIANDO O BANCO DE DADOS OFFLINE
firebase.firestore().enablePersistence().then(function(){
    //sucesso ao salvar os dados em cache
    console.log("esta sem conexao")


}).catch(function(err){

      if (err.code == 'failed-precondition') {
          //informa que não e ativo pois esta com mutiplas abas abertas
          
      } else if (err.code == 'unimplemented') {
          //o navegador não suporta o cache do firestore

      }
  });