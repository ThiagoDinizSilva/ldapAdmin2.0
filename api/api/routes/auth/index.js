/* eslint-disable no-undef */
const express = require("express");
const jwt = require("jsonwebtoken");
const { listarPermissoes } = require("../../helpers/Permissoes");
const authRoute = express();
const Usuario = require("../../helpers/Usuario");

//verifica se a requisição contém um token válido
function isValidRequest(req, res, next) {
	const bearerHeader = req.headers["authorization"];

	try {
		if (!bearerHeader) throw new Error("unauthorized");
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		req.token = jwt.verify(bearerToken, process.env.SECRET || 'secret');
		next();

	} catch (e) {
		res.status(403).send({
			status: false,
			data: { err: "unauthorized" }
		});
	}
}

//verifica se a requisição contém um token válido, se o mesmo for válido
// pega o login contido nele e verifica se o usuário está no grupo "admin"
async function isAdmin(req, res, next) {
	const bearerHeader = req.headers["authorization"];

	try {
		if (!bearerHeader) throw new Error("unauthorized");
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		req.token = jwt.verify(bearerToken, process.env.SECRET || 'secret');
		const { login } = req.token;
		const permissoes = (await listarPermissoes({ uid: login })).data;

		if (!permissoes.includes("admin")) throw new Error("unauthorized");

		next();

	} catch (err) {
		res.status(403).send({
			status: false,
			data: { err: err.message }
		});
	}
}

//rota para login
authRoute.post("/login", async (req, res, next) => {
	try {
		const dadosRecebidos = req.body;
		const usuario = new Usuario(dadosRecebidos);
		const usuarioLdap = await usuario.buscarInfo();
		const login = usuarioLdap.data[0].dn;
		const autenticado = await usuario.autenticar(login, dadosRecebidos.password);

		if (autenticado.code == 49)
			return res.status(200).send({
				status: true,
				data: {
					message: "Usuario ou senha incorretos"
				}
			});

		if (autenticado.code == 53)
			return res.status(200).send({
				status: true,
				data: {
					message: "Usuario ou senha incorretos"
				}
			});

		if (!autenticado)
			throw new Error(autenticado);


		const permissoes = (await listarPermissoes({ uid: dadosRecebidos.login })).data;
		if (!permissoes.includes("admin")) {
			return res.status(200).send({
				status: true,
				data: {
					message: "Usuário não possui permissão de Administrador"
				}
			});
		}

		const token = jwt.sign({
			login: dadosRecebidos.login,
			autenticado: true,
		}, process.env.SECRET || 'secret', {
			expiresIn: "6000000" // expires in 10min
		});

		return res.status(200).send({ status: true, data: { token } });

	} catch (err) {
		next(err);
	}
});
module.exports = { authRoute, isValidRequest, isAdmin };