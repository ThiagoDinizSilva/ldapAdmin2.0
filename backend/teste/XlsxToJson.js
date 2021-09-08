const readXlsxFile = require('read-excel-file/node')

const schema = {
    'nome': {
        prop: 'CLIENTE',
        type: (value) => {
            nome = value.trim().replace(/  +/g, ' >> ').toLowerCase()
            if (!nome) {
                throw new Error('invalid')
            }
            return nome
        }
    },
    'situacao': {
        prop: 'SITUACAO',
        type: String
    }
}

readXlsxFile('./1.xlsx', { schema }).then(({ rows, errors }) => {
    console.log(rows)


})