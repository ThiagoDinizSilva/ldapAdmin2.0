const TableModel2 = require ('./Usuario/ModeloTabelaUsuario')




TableModel2
.sync()
.then(() => console.log('Tabela Usuario Criada com Sucesso!'))
