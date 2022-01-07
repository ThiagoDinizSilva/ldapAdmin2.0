const express = require("express");
const Grupo = require("../../helpers/Grupo");
const groupRoute = express();

//Traz a lista de Grupos ou pesquisa grupos através de query parameters ?nome='Grupo'
groupRoute.get("/", async (req, res, next) => {
	try {
		const grupo = new Grupo({ nome: req.query.nome });
		const listaDeGrupos = await grupo.buscarGrupo();

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
		const grupo = new Grupo({ nome: req.params.id });
		const membros = await grupo.buscarMembros();
		res.status(200).send({
			status: true,
			data: membros.data[0].memberUid
		});

	} catch (err) {
		next(err);
	}
});

//adiciona um grupo
groupRoute.post("/", async (req, res, next) => {
	try {
		const grupo = new Grupo({ nome: req.body.nome });
		await grupo.novoGrupo();
		return res.status(201).send();

	} catch (err) {
		next(err);
	}
});

//deleta um grupo
groupRoute.delete("/", async (req, res, next) => {
	try {
		const grupo = new Grupo({ nome: req.body.nome });
		await grupo.deletar();
		return res.status(200).send();

	} catch (err) {
		next(err);
	}
});

//adiciona ou remove membros do grupo , 1 request por usuario
groupRoute.put("/:id", async (req, res, next) => {
	try {
		const { usuario, nome } = req.body;
		const nomeOriginal = req.params.id;
		const grupo = new Grupo({ nome: nomeOriginal, usuario });
		if (nomeOriginal != nome) {
			const atualizado = await grupo.atualizar(nome);
			res.status(200).send(atualizado)
		} else
			await grupo.atualizar();
		res.status(200).send()


	} catch (err) {
		next(err);
	}
});

module.exports = groupRoute;