import { Avatar, Button, IconButton, Input, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/gruposDetalhes.scss'
import api from '../../services/api';
import { Person } from '@mui/icons-material';
export const GrupoDetalhes: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [state, setState] = useState({
        nome: id,
        listaDeUsuarios: [],
        listaOutrosUsuarios: []
    })

    const [status, setStatus] = useState({
        loading: false,
        error: '',
        isValid: true
    })

    const updateUser = async (e) => {
        const userId = e.target.value
        await api.put(`/grupos/${id}`, {
            usuarios: [userId]
        })
            .then((response) => {
                getUsuarios()
            }).catch(({ response }) => {
                alert(response.data.message)
                console.log(JSON.stringify(response))
            });

    }

    const getUsuarios = async () => {
        let listaDeUsuarios: Array<any> = [];
        let listaOutrosUsuarios: Array<any> = [];
        await api.get(`/grupos/${id}`)
            .then((response) => {
                listaDeUsuarios = response.data[0].memberUid
            }).catch(({ response }) => {
            });

        await api.get(`/usuarios`)
            .then((response) => {
                listaOutrosUsuarios = response.data.map((e: any) => e.uid)
                listaOutrosUsuarios = listaOutrosUsuarios.filter(item => !listaDeUsuarios.includes(item));
            }).catch(({ response }) => {
                console.log(JSON.stringify(response))
            });

        setState({ ...state, listaDeUsuarios: listaDeUsuarios, listaOutrosUsuarios: listaOutrosUsuarios })
    }

    const handleForm = async (e: any) => {
        e.preventDefault();
        setStatus({ ...status, loading: true })
        await api.put(`/grupos/${id}`, {
            novoNome: state.nome
        })
            .then((response) => {
                alert(`O Grupo ${id} foi atualizado para: ${state.nome}`)
                navigate(`/grupos/${state.nome}`)
                setStatus({ ...status, loading: false })

            }).catch(({ response }) => {
                console.log(JSON.stringify(response))
            });
    }

    const validateGroup = async () => {
        await api.get(`/grupos/${id}`)
            .then((response) => {

            }).catch(({ response }) => {
                if (response.status == 404) {
                    alert('Grupo inexistente')
                    navigate('/grupos')
                }
            });
    }

    useEffect(() => {
        validateGroup()
        if (state.listaDeUsuarios.length == 0 && state.listaOutrosUsuarios.length == 0)
            getUsuarios()
    }, [state.listaDeUsuarios, state.listaOutrosUsuarios])

    return (
        <>
            <h2>Grupo: {id}</h2>
            <form className='gruposDetalhes-formulario'
                onSubmit={handleForm}
                id="gruposDetalhes"
            >
                <div>
                    <Input
                        className='half'
                        autoFocus={true}
                        error={status.error.length > 0}
                        placeholder='Nome do Grupo'
                        type='text'
                        value={state.nome}
                        onChange={(e) => setState({ ...state, nome: e.target.value })}
                    />
                    <Button
                        type="submit"
                        form="gruposDetalhes"
                        variant="contained"
                    >Atualizar Nome
                    </Button>
                    {status.error ? <p>{status.error}</p> : <p />}
                </div>
            </form>
            <div className='gruposDetalhes-divs'>
                <div className='gruposDetalhes-label-ul'>
                    <p>Membros do Grupo</p>
                    <ul className='gruposDetalhes-content-ul'>
                        {state.listaDeUsuarios.map(e => {
                            return <div key={e}
                            >
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end"
                                            aria-label="delete"
                                            onClick={updateUser}
                                            value={e}
                                        >
                                            <Delete />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Person />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={e}
                                    />
                                </ListItem>
                            </div>
                        })}
                    </ul>
                </div>
                <div className='gruposDetalhes-label-ul'>
                    <p>Outros Usuarios</p>
                    <ul className='gruposDetalhes-content-ul'>
                        {state.listaOutrosUsuarios.map((e, index) => {
                            return <div key={`${index},${e}`}
                            >
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end"
                                            aria-label="delete"
                                            onClick={updateUser}
                                            value={e}
                                        >
                                            <Add />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Person />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={e}
                                    />
                                </ListItem>
                            </div>
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}