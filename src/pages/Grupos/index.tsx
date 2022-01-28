import { Avatar, Button, IconButton, Input, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import '../../assets/styles/grupos.scss'
import { Edit, Group } from '@mui/icons-material';
import api from '../../services/api';
import { Link } from 'react-router-dom';
export const Grupos: React.FC = () => {

    const [status, setStatus] = useState({
        loading: false,
        error: ''
    })
    const [state, setState] = useState({
        nome: '',
        listaDeGrupos: []
    })

    const handleForm = async (e: any) => {
        e.preventDefault();
        await api.get(`/grupos/?id=${state.nome}`)
            .then((response) => {
                const listaDeGrupos = response.data.map((e: any) => e.cn)
                setState({ ...state, listaDeGrupos: listaDeGrupos })
                if (listaDeGrupos.length == 0)
                    alert(`Não foram encontrados registros com o nome: ${state.nome}`)

            }).catch(({ response }) => {
                console.log(JSON.stringify(response))
            });
    }

    const addGroup = async (e: any) => {
        setStatus({ loading: true, error: '' })
        await api.post(`/grupos`, {
            nome: state.nome
        })
            .then((response) => {
                alert(`Grupo ${state.nome} adicionado com sucesso!`)
                window.location.reload()
            }).catch(({ response }) => {
                setStatus({ loading: false, error: response.data.message })
                console.log(JSON.stringify(response))
            })
    }

    const deleteGroup = async (e: any) => {
        const ok = window.confirm(`Deseja mesmo excluir permanentemente o grupo ${e.target.value} ?`)
        if (ok) {
            setStatus({ loading: true, error: '' })
            await api.delete(`/grupos/${e.target.value}`)
                .then((response) => {
                    setStatus({ loading: false, error: '' })
                    setState({ ...state, listaDeGrupos: [] })

                }).catch(({ response }) => {
                    setStatus({ loading: false, error: response.data.message })
                    console.log(JSON.stringify(response))
                })
        }
    }

    const getGrupos = async () => {
        await api.get("/grupos")
            .then((response) => {
                const listaDeGrupos = response.data.map((e: any) => e.cn)
                setState({ ...state, listaDeGrupos: listaDeGrupos })

            }).catch(({ response }) => {
                console.log(JSON.stringify(response))
            });
    }

    useEffect(() => {
        if (state.listaDeGrupos.length == 0)
            getGrupos()
    }, [state.listaDeGrupos])

    return (
        <>
        <h2>Grupos</h2>
            <form className='grupo-formulario'
                onSubmit={handleForm}
                id="grupoForm"
            >
                <div className="grupo-formulario-textDanger">
                    <div>
                        <Input
                            className='half'
                            autoFocus={true}
                            error={status.error ? true : false}
                            placeholder='Nome do Grupo'
                            type='text'
                            value={state.nome}
                            onChange={(e) => setState({ ...state, nome: e.target.value })}
                        />
                        <div>
                            <Button
                                type="submit"
                                form="grupoForm"
                                variant="contained"
                            >Buscar
                            </Button>
                            <Button
                                onClick={addGroup}
                                variant="outlined"
                            >Adicionar
                            </Button>
                        </div>
                    </div>
                    {status.error ? <p>{status.error}</p> : <p />}
                </div>
            </form >

            <ul className='grupo-content-ul'>
                {state.listaDeGrupos.map(e => {
                    return <div>
                        <ListItem
                            key={e}
                            secondaryAction={
                                <div>
                                    <Link to={`/grupos/${e}`}>

                                        <IconButton edge="end"
                                            aria-label="edit"
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    <span />
                                    <IconButton edge="end"
                                        aria-label="delete"
                                        onClick={deleteGroup}
                                        value={e}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <Group />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={e}
                            />
                        </ListItem>
                    </div>
                })}
            </ul>
        </>
    )
}