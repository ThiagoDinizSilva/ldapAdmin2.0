/* eslint-disable no-undef */
/* eslint-disable no-unreachable */
const { Client, Change, Attribute } = require("ldapts");
const CryptoJS = require("crypto-js");
const Ldap = require("./Ldap");

const client = new Ldap();

class Usuario {
	constructor({ login, nome, sobrenome, nomeExibicao, grupo, password }) {
		this.uid = login;
		this.givenName = nome;
		this.sn = sobrenome;
		this.displayName = nomeExibicao;
		this.grupo = grupo;
		this.userPassword = password;
	}

	validar() {
		const campos = [
			["uid", "Login"],
			["givenName", "Nome"],
			["sn", "Sobrenome"],
			["displayName", "Nome de Exibicao"]
		];

		campos.forEach(campo => {
			const valor = this[campo[0]];
			if (typeof valor !== "string" || valor.length < 1)
				throw new Error(`O campo '${campo[1]}' precisa ser preenchido`);
		});
	}

	async autenticar(login, pass) {
		await client.bind(login, pass);
		await client.unbind();
		return ({ status: true, data: "autentcado" });

	}

	async buscarUsuario() {
		const atributos = ["initials","sn","displayName","uid","cn"]

		const filtro = `(&${this.uid ? `(uid=${this.uid}*)` : "(uid=*)"}${this.givenName ? `(givenName=*${this.givenName}*)` : ""}${this.sn ? `(sn=*${this.sn}*)` : ""}${this.displayName ? `(displayName=*${this.displayName}*)` : ""})`;
		const usuario = await client.buscar(filtro,atributos)
		if (!usuario) {
			return usuario;
		}

		return ({ status: true, data: usuario });

	}
	async listarUsuarios() {
		const filtro = `(&${this.uid ? `(uid=${this.uid}*)` : "(uid=*)"}${this.displayName ? `(displayName=*${this.displayName}*)` : ""})`;
		const atributos = ["initials","sn","displayName","uid","cn"]

		const usuario = await client.buscar(filtro,atributos)
		if (!usuario) {
			return usuario;
		}

		return ({ status: true, data: usuario });
	}

	async listarPermissoes(){
		return await client.buscarGruposContendoUsuario(this.uid);
	}

	async deletar() {
		await client.deletar(this.uid,"posixAccount");
		return ({ status: true, data: "" });
	}

	async adicionar() {
		this.validar();
		const usuarioAdicionado = await client.adicionarUsuario(this);
		return ({ status: true, data: usuarioAdicionado });
	}

	async atualizar() {
		await client.bind(usuario, senha);
		const {
			searchEntries
		} = await client.search(baseUsuarios, {
			scope: "sub",
			filter: `(uid=${this.uid})`
		});

		if (searchEntries > 1)
			throw new Error("Não é possível deletar mais de um usuário por vez");
		const userDN = searchEntries[0].dn;
		for (const atributo in this) {
			if (atributo == "userPassword" && this[atributo]) {
				this.userPassword = `{MD5}${CryptoJS.enc.Base64.stringify(CryptoJS.MD5(this.userPassword))}`;
			}
			if (this[atributo]) {
				let change = new Change({
					operation: "replace",
					modification: new Attribute({
						type: atributo,
						values: [this[atributo]]
					})
				});
				await client.modify(userDN, change);
				if (!userDN.includes(this.uid))
					await client.modifyDN(userDN, `uid=${this.uid}`);
			}
		}
		await client.unbind();
		return ({ status: true, data: "atualizado" });

	}
}
module.exports = Usuario;