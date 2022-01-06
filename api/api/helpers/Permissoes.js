/* eslint-disable no-undef */
const { Client, Change, Attribute } = require("ldapts");

const url = process.env.LDAP_URL || 'ldap://10.1.113.248:389';
const usuario = process.env.LDAP_USUARIO || 'cn=manager,dc=esao,dc=eb,dc=mil,dc=br';
const senha = process.env.LDAP_ADMIN_PASSWORD || 's3cr3t3sao';
const baseUsuarios = process.env.LDAP_BASEDN_USUARIOS || 'ou=people,dc=esao,dc=eb,dc=mil,dc=br';
const baseGrupos = process.env.LDAP_BASEDN_GRUPOS || 'ou=groups,dc=esao,dc=eb,dc=mil,dc=br';


const client = new Client({
	url,
});

module.exports = {
	async validarUsuario(uid) {
		const filtro = `(uid=${uid})`;
		await client.bind(usuario, senha);
		const {
			searchEntries
		} = await client.search(baseUsuarios, {
			scope: "sub",
			filter: filtro,
			attributes: ["displayName", "uid", "givenName", "sn"]
		});
		await client.unbind();
		if (searchEntries[0])
			return ({ status: true, data: searchEntries });
		return ({ status: false, data: "" });

	},
	async listarPermissoes({ uid }) {
		const grupos = [];
		const filtro = `(memberUid=${uid})`;
		try {
			await client.bind(usuario, senha);
			const {
				searchEntries
			} = await client.search(baseGrupos, {
				filter: filtro,
				attributes: ["cn"]
			});
			searchEntries.forEach(element => {
				grupos.push(element.cn);
			});
			return ({ status: true, data: grupos });
		} catch (err) {
			return ({ status: false, data: err });
		} finally {
			await client.unbind();
		}
	},

	async adicionarPermissoes({ uid, permissao }) {

		const change = new Change({
			operation: "add",
			modification: new Attribute({
				type: "memberUid",
				values: [`${uid}`]
			}),
		});
		await client.bind(usuario, senha);

		for (const element of permissao) {
			const {
				searchEntries
			} = await client.search(baseGrupos, {
				filter: `(cn=${element})`,
				attributes: ["cn", "memberUid"]
			});
			const { dn, memberUid } = searchEntries[0];
			if (memberUid.includes(uid))
				return ({ status: false, data: "" });

			await client.modify(dn, change);
		}
		await client.unbind();
		return ({ status: true, data: "" });
	},

	async removerPermissoes({ uid, permissao }) {
		const change = new Change({
			operation: "delete",
			modification: new Attribute({
				type: "memberUid",
				values: [`${uid}`]
			}),
		});

		await client.bind(usuario, senha);
		for (const element of permissao) {
			const {
				searchEntries
			} = await client.search(baseGrupos, {
				filter: `(cn=${element})`,
				attributes: ["cn", "memberUid"]
			});
			const { dn, memberUid } = searchEntries[0];
			if (!memberUid.includes(uid))
				return ({ status: false, data: "" });

			await client.modify(dn, change);
			return ({ status: true, data: "" });
		}

		await client.unbind();
	},
};