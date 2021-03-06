import { Avatar, Button, IconButton, Input, ListItem, ListItemAvatar, ListItemText, Pagination, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { Fragment, useEffect, useState } from 'react';
import styled from '../../assets/styles/usuarios.module.scss'
import { Edit, Person } from '@mui/icons-material';
import api from '../../services/api';
import { Link } from 'react-router-dom';
export const Usuarios: React.FC = () => {

    interface IUserProps {
        displayName: string;
        uid: string;
    }

    const [status, setStatus] = useState({
        loading: false,
        error: ''
    })
    const [state, setState] = useState({
        nome: '',
        listaDeUsuarios: [],
        page: 1,
        paginas: 0
    })

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setState({ ...state, page: value, listaDeUsuarios: [] });
    };

    const handleForm = async (e: any) => {
        e.preventDefault();
        await api.get(`/usuarios/?id=${state.nome}&page=${state.page}`)
            .then((response) => {
                const listaDeUsuarios = response.data.usuarios.map((e: any) => ({ uid: e.uid, displayName: e.displayName }))
                console.log(listaDeUsuarios)
                setState({ ...state, listaDeUsuarios: listaDeUsuarios, paginas: (~~(response.data.count / 50)) })
                if (listaDeUsuarios.length <= 0)
                    alert(`Não foram encontrados registros com o nome: ${state.nome}`)

            }).catch(({ response }) => {
                console.log(JSON.stringify(response))
            });
    }

    const deleteUser = async (e: any) => {
        const ok = window.confirm(`Deseja mesmo excluir permanentemente o usuário ${e.target.value} ?`)
        if (ok) {
            setStatus({ loading: true, error: '' })
            await api.delete(`/usuarios/${e.target.value}`)
                .then((response) => {
                    setStatus({ loading: false, error: '' })
                    setState({ ...state, listaDeUsuarios: [] })

                }).catch(({ response }) => {
                    setStatus({ loading: false, error: response.data.message })
                    console.log(JSON.stringify(response))
                })
        }
    }

    const getUsuarios = async () => {
        await api.get(`/usuarios/?page=${state.page}`)
            .then((response) => {
                const listaDeUsuarios = response.data.usuarios.map((e: any) => ({ uid: e.uid, displayName: e.displayName }))
                setState({ ...state, listaDeUsuarios: listaDeUsuarios, paginas: (~~(response.data.count / 50)) })

            }).catch(({ response }) => {
                console.log(JSON.stringify(response))
            });
    }

    useEffect(() => {
        if (state.listaDeUsuarios.length == 0)
            getUsuarios()
    }, [state.listaDeUsuarios])


    return (
        <Fragment>
            <h2>Usuarios</h2>
            <form className={styled.formulario}
                onSubmit={handleForm}
                id="usuarioForm"
            >
                <Input
                    className='half'
                    autoFocus={true}
                    error={status.error ? true : false}
                    placeholder='Nome do Usuario'
                    type='text'
                    value={state.nome}
                    onChange={(e) => setState({ ...state, nome: e.target.value })}
                />
                <Button
                    type="submit"
                    form="usuarioForm"
                    variant="contained"
                >Buscar
                </Button>
                {status.error ? <p>{status.error}</p> : <p />}
            </form>
            <ul className={styled.contentUl}>
                {state.listaDeUsuarios[0] ? state.listaDeUsuarios.map((e: IUserProps) => {
                    return <div>
                        <ListItem
                            secondaryAction={
                                <div>
                                    <Link to={`/usuarios/${e.uid}`}>
                                        <IconButton edge="end"
                                            aria-label="edit"
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    <IconButton edge="end"
                                        aria-label="delete"
                                        onClick={deleteUser}
                                        value={e.uid}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <Person />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={e.uid}
                                secondary={`${e.displayName}`}
                            />
                        </ListItem>
                    </div>
                }) :
                    <div />
                }
            </ul>
            <Stack spacing={2}>
                <Pagination count={state.paginas} boundaryCount={1} page={state.page} onChange={handleChange} color="primary" />
            </Stack>
        </Fragment>
    )
}