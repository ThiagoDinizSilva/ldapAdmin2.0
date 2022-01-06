/* eslint-disable no-undef */
const express = require("express");
const app = express();
app.use(express.json());
const { authRoute, isAdmin } = require("./routes/auth");
const groupRoute = require("./routes/group");
const userRoute = require("./routes/user");

//Rota para Autenticação
app.use("/auth", authRoute);
//Rota de Usuarios
app.use("/usuarios", isAdmin, userRoute);
//Rota de Permissoes
app.use("/permissoes", isAdmin, groupRoute);

//Manipula os Erros
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	if (err.message.includes("ECONNREFUSED"))
		return res.status(500).send({
			status: false,
			data: { err: "Conexão recusada pelo LDAP" }
		});

	if (err.message.includes("0x31")) {
		return res.status(400).send({
			status: false,
			data: { err: "Usuario ou senha inválidos" }
		});
	}
	if (err.message.includes("dn")) {
		if (err.message.includes("searchEntries[0]"))
			return res.status(400).send({
				status: false,
				data: { err: "Usuário Não possui esta permissão, por favor recarregue a página" }
			});

		return res.status(400).send({
			status: false,
			data: { err: "Registro inexistente" }
		});
	}

	if (err.message.includes("0x20")) {
		return res.status(400).send({
			status: false,
			data: { err: "Algo não ocorreu como deveria, entre em contato com o Administrador" }
		});
	}
	if (err.message.includes("0x44")) {
		return res.status(304).send({
			status: false,
			data: { err: "Registro ja existe no Ldap" }
		});
	}

	if (err.message.includes("0x35")) {
		return res.status(200).send({
			status: false,
			data: { err: "Usuário ou senha inválidos" }
		});
	}

	if (err.message.includes("of undefined")) {
		console.log(err);
		return res.status(400).send({
			status: false,
			data: { err: "Registro inválido" }
		});
	}

	if (err.message.includes("ECONNREFUSED")) {
		return res.status(400).send({
			status: false,
			data: { err: "Falha ao conectar-se ao LDAP" }
		});
	}
	res.status(500).send(
		{
			status: false,
			data: { err: err.message }
		});
});

app.listen(process.env.API_PORT || '3000', () => console.log(`API LISTENING IN ${process.env.API_PORT || '3000'}`));