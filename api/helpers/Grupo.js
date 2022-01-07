/* eslint-disable no-undef */
/* eslint-disable no-unreachable */
const Ldap = require("./Ldap");

const client = new Ldap();

class Grupo {
	constructor({ nome, usuario }) {
		this.cn = nome;
		this.membro = usuario;
		this.objectClass = ["posixGroup", "top"];
	}

	async buscarGrupo() {
		const filtro = `(&(cn=${this.cn ? `${this.cn}*` : "*"})(objectClass=posixGroup))`
		const atributos = ["memberUid", "cn"]
		const grupos = await client.buscar(filtro, atributos)
		if (!grupos) {
			return grupos;
		}

		return ({ status: true, data: grupos });
	}

	async buscarMembros() {
		const filtro = `(&(cn=${this.cn})(objectClass=posixGroup))`;
		const atributos = ["memberUid", "cn"]
		const membros = await client.buscar(filtro, atributos)
		if (!membros) {
			return membros;
		}

		return ({ status: true, data: membros });

	}

	async novoGrupo() {
		await client.adicionarGrupo(this);
		return ({ status: true });
	}

	async deletar() {
		await client.deletar(this.cn,"posixGroup");
		return ({ status: true, data: "" });
	}

	async atualizar(novoNome) {
		const filtroUsuario = `(&(uid=${this.membro})(objectClass=posixAccount))`;
		const usuarioExiste = await client.buscar(filtroUsuario)
		if (!usuarioExiste)
			throw new TypeError("dn Inexistente");

		const filtroGrupo = `(&(cn=${this.cn})(objectClass=posixGroup))`
		const atributos = ["cn", "memberUid", "uid"]
		const grupo = await client.buscar(filtroGrupo, atributos)
		if (!grupo) {
			throw new TypeError("dn Inexistente");
		}
		if (novoNome != grupo.cn) {
			await client.atualizarNome(grupo[0], novoNome)
			return ({ status: true, data: novoNome });
		}
		client.atualizarMembrosGrupo(grupo[0], this.membro)
		return ({ status: true, data: "atualizado" });

	}

}
module.exports = Grupo;