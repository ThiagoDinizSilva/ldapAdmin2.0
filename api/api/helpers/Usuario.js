/* eslint-disable no-undef */
/* eslint-disable no-unreachable */
const { Client, Change, Attribute } = require("ldapts");
const CryptoJS = require("crypto-js");

const url = process.env.LDAP_URL || 'ldap://10.1.113.248:389';
const usuario = process.env.LDAP_USUARIO || 'cn=manager,dc=esao,dc=eb,dc=mil,dc=br';
const senha = process.env.LDAP_ADMIN_PASSWORD || 's3cr3t3sao';
const baseUsuarios = process.env.LDAP_BASEDN_USUARIOS || 'ou=people,dc=esao,dc=eb,dc=mil,dc=br';
const baseGrupos = process.env.LDAP_BASEDN_GRUPOS || 'ou=people,dc=esao,dc=eb,dc=mil,dc=br';

const client = new Client({
	url: url,
});
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

	async buscarInfo() {
		const filtro = `(&${this.uid ? `(uid=${this.uid}*)` : "(uid=*)"}${this.givenName ? `(givenName=*${this.givenName}*)` : ""}${this.sn ? `(sn=*${this.sn}*)` : ""}${this.displayName ? `(displayName=*${this.displayName}*)` : ""})`;
		await client.bind(usuario, senha);
		const {
			searchEntries
		} = await client.search(baseUsuarios, {
			scope: "sub",
			filter: filtro,
			attributes: ["displayName", "uid", "givenName", "sn"]
		});
		await client.unbind();
		return ({ status: true, data: searchEntries });

	}
	async pesquisar() {
		const filtro = `(&${this.uid ? `(uid=${this.uid}*)` : "(uid=*)"}${this.displayName ? `(displayName=*${this.displayName}*)` : ""})`;
		await client.bind(usuario, senha);
		const {
			searchEntries
		} = await client.search(baseUsuarios, {
			scope: "sub",
			filter: filtro,
			attributes: ["displayName", "uid"]
		});
		for (const key in searchEntries) {
			delete searchEntries[key]["dn"];
		}
		await client.unbind();
		return ({ status: true, data: searchEntries });

	}

	async deletar() {
		const usuarioDeletado = await this.buscarInfo();
		if (usuarioDeletado.data.length <= 0)
			throw new TypeError("dn Inexistente");
		const { dn } = usuarioDeletado.data[0];

		await client.bind(usuario, senha);
		if (dn.includes(this.uid)) {
			await client.del(dn);
		}
		await client.unbind();
		return ({ status: true, data: "deletado" });
	}

	async adicionar() {
		const pass = CryptoJS.MD5(this.uid);
		this.validar();
		const userDN = `uid=${this.uid},${baseUsuarios}`;
		const uidNumber = (Math.floor(Math.random() * 65534) + 1000).toString();
		const gidNumber = (Math.floor(Math.random() * 65534) + 1000).toString();

		const entry = {
			objectClass: ["posixAccount", "top", "inetOrgPerson"],
			givenName: this.givenName,
			sn: this.sn,
			displayName: this.displayName,
			userPassword: `{MD5}${CryptoJS.enc.Base64.stringify(pass)}`,
			cn: this.uid,
			homeDirectory: "/home/null",
			loginShell: "/bin/false",
			uidNumber: uidNumber,
			gidNumber: gidNumber
		};

		await client.bind(usuario, senha);
		await client.add(userDN, entry);
		await client.unbind();
		return ({ status: true, data: "adicionado" });
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