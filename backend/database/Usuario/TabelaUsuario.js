const Modelo = require('./ModeloTabelaUsuario')
const CryptoJS = require("crypto-js");

module.exports = {
    //OK
    async autenticarUsuario(login, password) {
        try {
            const encontrado = await Modelo.findOne({
                where: {
                    login: login,
                },
                attributes: ['login', 'password']
            })
            if (!encontrado)
                return ({ 'status': false, 'error': "Usuário ou Senha Inválidas" })

            const hashPass = encontrado.dataValues.password
            const bytes = CryptoJS.AES.decrypt(hashPass, process.env.SECRET);
            const originalPass = bytes.toString(CryptoJS.enc.Utf8);

            if (originalPass != password)
                return ({ 'status': false, 'error': "Usuário ou Senha Inválidas" })

            return { login }
        } catch (err) {
            throw new Error('Algo não ocorreu como deveria, contate o administrador! ERR TB32')
        }
    },

    //OK
    async listarUsuarios() {
        try {
            const encontrado = await Modelo.findAll({
                attributes: ['login']
            })
            return encontrado
        } catch (err) {
            throw new Error('Algo não ocorreu como deveria, contate o administrador! ERR TB32')
        }
    },

    //
    buscarUsuario(login) {
        try {
            const encontrado = Modelo.findOne({
                where: {
                    login: login
                },
                attributes: ['login']
            });
            return encontrado
        } catch (err) {
            throw new Error('Algo não ocorreu como deveria, contate o administrador! ERR TB32')
        }
    },

    //OK
    async criarUsuario(login, password) {
        const userPass = CryptoJS.AES.encrypt(password, process.env.SECRET).toString();
        try {
            const usuario = await Modelo.create({
                login: login,
                password: userPass
            });
            return (`Usuario ${login} criado com sucesso!`)
        } catch (err) {
            console.log(err)
            //throw new Error(`Algo não ocorreu como deveria, Preencha os campos corretamente`)
        }
    },

    //OK
    async alterarUsuario(login, newPassword) {
        if (!newPassword) throw new Error(`preencha o campo 'senha'`)

        const pass = CryptoJS.AES.encrypt(newPassword, process.env.SECRET).toString()
        try {
            const campoAtualizado = {
                password: pass
            }
            Modelo.update(campoAtualizado, {
                where: { login: login }
            })
            return ('Informações atualizadas com Sucesso')
        } catch (err) {
            console.log(err)
        }
    },

    //OK
    async deletarUsuario(login) {
        try {
            const usuario = await this.buscarUsuario(login);
            if (!usuario)
                throw new Error(`Não é possível deletar um usuario inexistente`)
            await Modelo.destroy({
                where: {
                    login: login
                }
            });
            return
        } catch (err) {
            throw new Error(`Algo não ocorreu como deveria ERR TB59`)
        }
    },

}