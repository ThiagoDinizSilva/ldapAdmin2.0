const express = require("express");
const Grupo = require("../../helpers/Grupo");
const groupRoute = express();

//Traz a lista de Grupos ou pesquisa grupos através de query parameters ?nome='Grupo'
groupRoute.get("/", async (req, res, next) => {
	try {
		const name = req.query.nome;
		const grupo = new Grupo({ login: name });
		const listaDeGrupos = await grupo.buscar();

		res.status(200).send({
			status: true,
			data: { grupos: listaDeGrupos.data }
		});

	} catch (err) {
		next(err);
	}
});

//Traz a lista dos usuarios do grupo
groupRoute.get("/:id", async (req, res, next) => {
	try {
		const name = req.params.id;
		const grupo = new Grupo({ name });
		const membros = await grupo.buscarMembros();
		console.log(membros)
		res.status(200).send({
			status: true,
			data: membros.data[0]
		});

	} catch (err) {
		next(err);
	}
});

//adiciona um grupo
groupRoute.post("/adicionar", async (req, res, next) => {
	try {
		const { name, members } = req.body;
		const grupo = new Grupo({ name, members });
		const adicionar = await grupo.adicionar();
		const { status } = adicionar;
		if (status)
			return res.status(201).send();

	} catch (err) {
		next(err);
	}
});

//deleta um grupo
groupRoute.delete("/:id", async (req, res, next) => {
	try {
		const name = req.params.id;
		const grupo = new Grupo({ name });
		const deletar = await grupo.deletar();

		if (!deletar.status)
			return res.status(304).send();
		return res.status(200).send();

	} catch (err) {
		next(err);
	}
});

//adiciona ou remove membros do grupo através do body 'op= add || del'
groupRoute.put("/:id", async (req, res, next) => {
	try {
		const { name, members, op } = req.body;
		const grupo = new Grupo({ name, members });

		if (op == "add") {
			const membrosAdicionados = await grupo.adicionarMembros();
			console.log(membrosAdicionados);
			if (!membrosAdicionados.status)
				return res.status(304).send();
			return res.status(201).send();

		} else if (op == "del") {
			const membrosDeletados = await grupo.removerMembros();
			if (!membrosDeletados.status)
				return res.status(304).send();
			return res.status(200).send();

		} else {
			return res.status(400).send();
		}

	} catch (err) {
		next(err);
	}
});

module.exports = groupRoute;