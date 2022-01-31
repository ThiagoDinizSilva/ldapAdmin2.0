import { LoadingButton } from '@mui/lab';
import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../services/api';
import styled from '../../assets/styles/usuariosDetalhes.module.scss'

export const UsuarioDetalhes: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [state, setState] = useState({
        identidade: id,
        nome: '',
        sobrenome: '',
        mail: '',
        senha: '',
        valid: false
    })

    const [status, setStatus] = useState({
        loading: false,
        error: ''
    })

    const handleForm = async (e: any) => {
        e.preventDefault();
        setStatus({ ...status, loading: true })
        await api.put(`/usuarios/${id}`, {
            novaIdentidade: (state.identidade != id ? state.identidade : ''),
            email: state.mail,
            senha: state.senha,
            sobrenome: state.sobrenome,
            nome: state.nome
        })
            .then((response) => {
                if (id != state.identidade) {
                    alert(`O Usuario ${id} foi atualizado para: ${state.identidade}`)
                    navigate(`/usuarios/${state.identidade}`)
                    window.location.reload()
                } else {
                    alert(`O Usuario ${id} foi atualizado`)
                }
                setStatus({ ...status, loading: false })

            }).catch(({ response }) => {
                alert(response.data.message)
                console.log(JSON.stringify(response))
            });
    }

    const getUsuarioInfo = async () => {
        await api.get(`/usuarios/${id}`)
            .then((response) => {
                const usuario = response.data[0]
                setState({
                    identidade: id,
                    nome: usuario.givenName,
                    sobrenome: usuario.sn,
                    mail: usuario.mail,
                    senha: '',
                    valid: true
                })

            }).catch(({ response }) => {
                if (response.status == 404) {
                    alert('Usuario inexistente')
                    navigate('/usuarios')
                }
            });
    }

    useEffect(() => {
        if (!state.valid) {
            getUsuarioInfo()
        }
    }, [state.valid])

    return (
        <>
            <h2>Usuario: {id}</h2>
            <form
                className={styled.formulario}
                onSubmit={handleForm}
                id="atualizarUsuario">
                <div>
                    <TextField id="outlined-basic"
                        label="Identidade"
                        variant="outlined"
                        required
                        className='full'
                        autoFocus={true}
                        placeholder='Identidade'
                        type='text'
                        value={state.identidade}
                        onChange={(e) => setState({ ...state, identidade: e.target.value })}
                    />
                    <TextField id="outlined-basic"
                        label="E-Mail"
                        variant="outlined"
                        className='full'
                        autoFocus={true}
                        placeholder='E-mail'
                        type='email'
                        value={state.mail}
                        onChange={(e) => setState({ ...state, mail: e.target.value })}
                    />
                    <TextField id="outlined-basic"
                        label="Nome"
                        variant="outlined"
                        required
                        className='half'
                        autoFocus={true}
                        placeholder='Primeiro Nome'
                        type='text'
                        value={state.nome}
                        onChange={(e) => setState({ ...state, nome: e.target.value })}
                    />
                    <TextField id="outlined-basic"
                        label="Sobrenome"
                        variant="outlined"
                        className='half'
                        autoFocus={true}
                        placeholder='Sobrenome'
                        type='text'
                        value={state.sobrenome}
                        onChange={(e) => setState({ ...state, sobrenome: e.target.value })}
                    />
                    <TextField id="outlined-basic"
                        label="Senha"
                        variant="outlined"
                        className='half'
                        autoFocus={true}
                        placeholder='Senha'
                        type='text'
                        value={state.senha}
                        onChange={(e) => setState({ ...state, senha: e.target.value })}
                    />
                </div>
                {status.loading ?
                    <LoadingButton
                        loading
                        variant="contained"
                        startIcon={<SaveIcon />}
                    ></LoadingButton> :
                    <Button
                        type="submit"
                        form="atualizarUsuario"
                        variant="contained"
                    >Atualizar
                    </Button>
                }
            </form>
        </>
    )
}