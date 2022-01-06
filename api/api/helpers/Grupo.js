/* eslint-disable no-undef */
/* eslint-disable no-unreachable */
const { Client, Change, Attribute } = require("ldapts");
const { adicionarPermissoes, validarUsuario, removerPermissoes, listarPermissoes } = require("../helpers/Permissoes");

const url = process.env.LDAP_URL || 'ldap://10.1.113.248:389';
const login = process.env.LDAP_USUARIO || 'cn=manager,dc=esao,dc=eb,dc=mil,dc=br';
const pass = process.env.LDAP_ADMIN_PASSWORD || 's3cr3t3sao';
const baseUsuarios = process.env.LDAP_BASEDN_USUARIOS || 'ou=people,dc=esao,dc=eb,dc=mil,dc=br';
const baseGrupos = process.env.LDAP_BASEDN_GRUPOS || 'ou=groups,dc=esao,dc=eb,dc=mil,dc=br';

const client = new Client({
	url: url,
});

class Grupo {
	constructor({ name, members = [] }) {
		this.cn = name;
		this.members = members;
	}

	async buscar() {
		const filtro = `(&(cn=${this.cn ? `${this.cn}*` : "*"})(objectClass=posixGroup))`;
		await client.bind(login, pass);
		const {
			searchEntries
		} = await client.search(baseGrupos, {
			scope: "sub",
			filter: filtro,
			attributes: ["memberUid", "cn"]
		});
		await client.unbind();
		return ({ status: true, data: searchEntries });

	}

	async buscarMembros() {
		const filtro = `(&(cn=${this.cn})(objectClass=posixGroup))`;
		await client.bind(login, pass);
		const {
			searchEntries
		} = await client.search(baseGrupos, {
			scope: "sub",
			filter: filtro,
			attributes: ["memberUid", "cn"]
		});
		await client.unbind();
		return ({ status: true, data: searchEntries });

	}

	async adicionarMembros() {
		for (const membro of this.members) {
			if (membro) {
				const usuarioValido = await validarUsuario(membro);
				const permissoesDoUsuario = await listarPermissoes({ uid: membro });
				if (permissoesDoUsuario.data.includes(this.cn))
					return ({ status: false, data: "" });

				if (usuarioValido.status)
					await adicionarPermissoes({ uid: membro, permissao: [this.cn] });
			}
		}
		return ({ status: true, data: "" });

	}

	async removerMembros() {
		for (const membro of this.members) {
			if (membro) {
				const usuarioValido = await validarUsuario(membro);
				const permissoesDoUsuario = await listarPermissoes({ uid: membro });
				if (!permissoesDoUsuario.data.includes(this.cn))
					return ({ status: false, data: "" });
				if (usuarioValido.status)
					await removerPermissoes({ uid: membro, permissao: [this.cn] });
			}
		}
		return ({ status: true, data: "" });

	}

	async adicionar() {
		const groupDN = `cn=${this.cn},${baseGrupos}`;
		const gidNumber = (Math.floor(Math.random() * 65534) + 1000).toString();
		const entry = {
			objectClass: ["posixGroup", "top"],
			cn: this.cn,
			gidNumber: gidNumber
		};

		await client.bind(login, pass);
		await client.add(groupDN, entry);
		this.adicionarMembros();
		client.unbind();
		return ({ status: true, data: "adicionado" });

	}



	async deletar() {
		const grupo = await this.buscar();

		if (grupo.data.length <= 0)
			return new TypeError("dn Inexistente");
		const { dn } = grupo.data[0];
		if (dn.includes(this.cn)) {
			await client.bind(login, pass);
			await client.del(dn);
			await client.unbind();
		}
		return ({ status: true, data: "deletado" });


	}

	async atualizar() {
		await client.bind(login, pass);

		const {
			searchEntries
		} = await client.search(baseUsuarios, {
			scope: "sub",
			filter: `(cn=${this.cn})`
		});
		const grupoDN = searchEntries[0].dn;

		this.members.forEach(membro => {

			const change = new Change({
				operation: "add",
				modification: new Attribute({
					type: "memberUid",
					values: [`${membro}`]
				})
			});

			client.modify(grupoDN, change);

		});
		await client.unbind();

		return ({ status: true, data: "atualizado" });

	}
}
module.exports = Grupo;