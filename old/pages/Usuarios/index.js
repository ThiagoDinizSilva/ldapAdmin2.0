import React, { useState } from 'react';
import "../../assets/scss/usuarios.scss";
import { Input, Input2, Select1 } from '../../components/Input';
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineClose, AiOutlineForm, AiOutlineUnlock } from 'react-icons/ai'
import api from '../../services/api'

function Usuarios() {
  const [isOpen, setIsOpen] = useState(false)
  const [resultados, setResultados] = useState([])
  const [state, setState] = useState({
    uid: "",
    givenName: "",
    sn: "",
    nomeGuerra: "",
    aluno: "",
    curso: "",
    ano: "",
    grad: "",
    initials: "",
    err: ""
  })


  function isAluno(e) {
    const alunos = ['2021', '2020']
    if (alunos.some(alunos => e.includes(alunos))) {
      return true
    } else {
      return false
    }
  }

  async function handleOption(e) {
    const { id, value, style } = e.target
    const aluno = document.getElementById('initials').value
    setState({
      ...state,
      [id]: value,
      aluno: isAluno(aluno)
    })

    if (value) {
      style.color = '#000'
    } else {
      style.color = '#b6bdc1'
    }
  }

  function handleTab(e) {
    setIsOpen(!isOpen)
  }

  async function handleSearch(e) {
    e.preventDefault();
    const { uid, givenName, sn, grad, nomeGuerra } = state
    const displayName = `${grad ? grad + ' ' + nomeGuerra : nomeGuerra ? nomeGuerra : ''}`
    try {
      await api.get("/usuarios",
        {
          params: {
            uid, displayName, givenName, sn
          }
        })
        .then((response) => {
          setResultados(response.data)
        });
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { uid, givenName, sn, grad, nomeGuerra, aluno, initials } = state
    const displayName = `${grad ? grad + ' ' + nomeGuerra : nomeGuerra ? nomeGuerra : ''}`
    try {
      await api.post("/usuarios/adicionar", {},
        {
          params: {
            uid, givenName, sn, displayName, initials, aluno, grad
          }
        })
        .then((response) => {
          if (!response.data.status) {
            setState({
              ...state,
              err: response.data.message
            })
          } else {
            window.location.reload();
            alert(response.data.message)
          }
        });
    } catch (err) {
      console.log(err.response)
      alert(err.response)
    }
  }

  async function passwordReset(e) {
    const uid = e.target.id
    try {
      await api.post("/usuarios/atualizarUsuario", {},
        {
          params: {
            uid,
            userPassword: uid
          }
        })
        .then((response) => {
          if (response.data.status) {
            alert('Senha Resetada com Sucesso')
          }
        });
    } catch (err) {
      console.log(err.response)
    }

  }

  async function updateUser(e) {

  }

  async function deleteUser(e) {
    const uid = e.target.id
    const deleteUser = window.confirm(`TEM CERTEZA QUE DESEJA DELETAR O USUARIO ${uid}?`);
    if (deleteUser) {
      try {
        await api.post("/usuarios/deletarUsuario", {},
          {
            params: {
              uid
            }
          })
          .then((response) => {
            if (response.data.status) {
              const resultadosSemUsuario = resultados.filter(obj => obj.uid !== uid)
              setResultados(resultadosSemUsuario)
              alert(response.data.message)
            }
          });
      } catch (err) {
        console.log(err.response)
      }
    }
  }

  return (
    <main className="usuarios">
      <div className='usuarios box'>
        <form onSubmit={handleSearch} className={isOpen ? 'usuarios formulario aberto' : 'usuarios formulario'}>
          <Input placeholder="Identidade"
            id='uid'
            value={state.uid}
            onChange={handleOption} />
          <Input placeholder="Nome De Guerra"
            id='nomeGuerra'
            value={state.nomeGuerra}
            onChange={handleOption} />
          <Input2 placeholder="Primeiro Nome"
            id='givenName'
            value={state.givenName}
            onChange={handleOption} />
          <Input2 placeholder="Sobrenome"
            id='sn'
            value={state.sn}
            onChange={handleOption} />
          <div className="formulario opcoes">
            <Select1 id="initials" onChange={handleOption}>
              <option value="">Tipo</option>
              <option value="2020 CAO">Aluno 2020</option>
              <option value="2021 CAO">Aluno 2021</option>
              <option value="2021 ECEME">Aluno ECEME</option>
              <option value="ECEME">ECEME</option>
              <option value="EsAO">Corpo Permanente</option>
              <option value="ONA">ONA</option>
            </Select1>
            <Select1 id="grad" onChange={handleOption}>
              <option value="">Graduação </option>
              <option value="sd">SD</option>
              <option value="cb">CB</option>
              <option value="sgt">SGT</option>
              <option value="st">ST</option>
              <option value="asp">ASP</option>
              <option value="ten">TEN</option>
              <option value="cap">CAP</option>
              <option value="maj">MAJ</option>
              <option value="tc">TC</option>
              <option value="cel">CEL</option>
              <option value="gen">GEN</option>
            </Select1>
            <Select1 id="curso" onChange={handleOption}>
              <option value="">Quadro/Arma </option>
              <option value="CArt">CArt</option>
              <option value="CCav">CCav</option>
              <option value="CCom">CCom</option>
              <option value="CEng">CEng</option>
              <option value="CInf">CInf</option>
              <option value="CLog">CLog</option>
              <option value="CSau">CSau</option>
            </Select1>
          </div>
          <button />
        </form>
        <div className='fade'>
          {isOpen ? <AiOutlineCaretUp onClick={handleTab} /> : <AiOutlineCaretDown onClick={handleTab} />}
          <p>{state.err}</p>
          <button className="cadastrar" onClick={handleSubmit}>Cadastrar Usuario</button>
          <button className="buscar" onClick={handleSearch}>Pesquisar</button>
        </div>
        <div className='resultados'>
          <li className="index-label">
            <p>Nome de Guerra</p>
            <p>Identidade</p>
          </li>
          {resultados.map((todo, index) => <li key={todo.dn} className="index-item">
            <p className="index-item-text">{todo.displayName}</p>
            <p>{todo.uid}</p>
            <div className="index-icon-div">
              <button name="changePassword" id={todo.uid} onClick={passwordReset}>
                <AiOutlineUnlock />
              </button>
              <button name="changeUser" id={todo.uid} onClick={updateUser}>
                <AiOutlineForm />
              </button>
              <button name="deleteUser" id={todo.uid} onClick={deleteUser}>
                <AiOutlineClose />
              </button>
            </div>
          </li>
          )}

        </div>
      </div>
    </main >
  );
};

export default Usuarios;
