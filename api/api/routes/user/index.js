const express = require("express");
const { listarPermissoes } = require("../../helpers/Permissoes");
const userRoute = express();
const Usuario = require("../../helpers/Usuario");
const { adicionarPermissoes, removerPermissoes } = require("../../helpers/Permissoes");

//Traz a lista de Usuarios ou pesquisa usuarios através de query parameters login='Usuario'
userRoute.get("/", async (req, res, next) => {
	try {
		const login = req.query.login;
		const usuario = new Usuario({ login });
		const listaDeUsuarios = await usuario.pesquisar();
		res.status(200).send({
			status: true,
			data: { usuarios: listaDeUsuarios.data }
		});

	} catch (err) {
		next(err);
	}
});

//Traz as informações completas sobre um usuário
userRoute.get("/:id", async (req, res, next) => {
	try {
		const login = req.params.id;
		const usuario = new Usuario({ login });
		const { data } = await usuario.buscarInfo();
		data[0].permissoes = (await listarPermissoes({ uid: login })).data;
		return res.status(200).send({
			status: true,
			data
		});

	} catch (err) {
		next(err);
	}
});

//adiciona um usuario
userRoute.post("/adicionar", async (req, res, next) => {
	try {
		const dadosRecebidos = req.body;
		const usuario = new Usuario(dadosRecebidos);
		const adicionar = await usuario.adicionar();

		const { status } = adicionar;
		if (status)
			return res.status(201).send();

	} catch (err) {
		next(err);
	}
});

//atualiza informações do usuario e caso o body contenha 'op',
// repassa a req para a proxima url que vai cuidar das permissoes
userRoute.put("/:id", async (req, res, next) => {
	try {
		const dadosRecebidos = req.body;
		dadosRecebidos.login = req.params.id;
		const usuario = new Usuario(dadosRecebidos);
		const atualizar = await usuario.atualizar();
		if (dadosRecebidos.op)
			return next();

		if (!atualizar.status)
			return res.status(304).send();

		return res.status(200).send();


	} catch (err) {
		next(err);
	}
});

//adiciona ou remove as permissões de um usuario atraves do body 'op= add || del'
userRoute.put("/:id", async (req, res, next) => {
	try {
		const login = req.params.id;
		const { op, permissao } = req.body;

		if (op == "add") {
			const usuario = await adicionarPermissoes({ uid: login, permissao });
			if (!usuario.status)
				return res.status(304).send();
			return res.status(201).send();

		} else if (op == "del") {
			const usuario = await removerPermissoes({ uid: login, permissao });
			if (!usuario.status)
				return res.status(304).send();
			return res.status(200).send();

		} else {
			return res.status(400).send();
		}

	} catch (err) {
		next(err);
	}
});

//deleta um usuario
userRoute.delete("/:id", async (req, res, next) => {
	try {
		const login = req.params.id;
		const usuario = new Usuario({ login });
		const deletado = await usuario.deletar();
		if (!deletado.status)
			return res.status(304).send();
		return res.status(200).send(deletado);

	} catch (err) {
		next(err);
	}
});

module.exports = userRoute;