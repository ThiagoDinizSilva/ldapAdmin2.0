import { Fragment, useEffect, useState } from 'react';
import { Input, InputLabel, Select, MenuItem, FormControl, Button, TextField } from '@mui/material';
import '../../assets/styles/cadastro.scss'
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../services/api';

interface IState {
    identidade: string;
    nome: string;
    sobrenome: string;
    grupo: string;
    listaDeGrupos: Array<string>;
    senha: string;
    senhaConfirmacao: string;
    email: string;
    passwordMatch: Boolean;
}

interface IStatus {
    loading: Boolean;
    error: string;
}

export const Cadastro: React.FC = () => {
    const [status, setStatus] = useState<IStatus>({ loading: false, error: '' })
    const [state, setState] = useState<IState>({
        identidade: '',
        nome: '',
        sobrenome: '',
        senha: '',
        senhaConfirmacao: '',
        email: '',
        grupo: '',
        listaDeGrupos: [],
        passwordMatch: true
    })

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleForm = async (e: any) => {
        e.preventDefault();
        if (!state.passwordMatch)
            return
        setStatus({ loading: true, error: "" })
        await api.post("/usuarios", {
            identidade: state.identidade,
            nome: state.nome,
            sobrenome: state.sobrenome,
            email: state.email,
            senha: state.senha,
            grupo: state.grupo

        })
            .then((response) => {
                alert(`Usuário ${state.identidade} cadastrado com sucesso!`)
                setStatus({ loading: false, error: "" })
                setState({
                    ...state,
                    identidade: '',
                    nome: '',
                    sobrenome: '',
                    senha: '',
                    senhaConfirmacao: '',
                    email: '',
                    grupo: '',
                    passwordMatch: true
                })
            }).catch(({ response }) => {
                if (response.status == 400)
                    setStatus({ loading: false, error: response.data.message })
            });
        return
    };

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
        if (state.listaDeGrupos.length == 0) {
            getGrupos()
        } else {
            if (state.senha != state.senhaConfirmacao)
                setState({ ...state, passwordMatch: false });
            else
                setState({ ...state, passwordMatch: true });
        }

    }, [state.senha, state.senhaConfirmacao, state.listaDeGrupos])

    return (
        <Fragment>
            <h2>Cadastro</h2>
            <form className='cadastro-formulario'
                onSubmit={handleForm}
                id="cadastroForm"
            >
                <div>
                    <div className="cadastro-formulario-textDanger">
                        <TextField id="outlined-basic"
                            label="Identidade"
                            variant="outlined"
                            required
                            className='full'
                            autoFocus={true}
                            error={(status.error.length > 0)}
                            type='text'
                            value={state.identidade}
                            onChange={(e) => setState({ ...state, identidade: e.target.value })}
                        />
                        {status.error ? <p>{status.error}</p> : <p />}
                    </div>
                    <TextField id="outlined-basic"
                        label="Primeiro Nome"
                        variant="outlined"
                        required
                        className='half'
                        autoFocus={true}
                        type='text'
                        value={state.nome}
                        onChange={(e) => setState({ ...state, nome: e.target.value })}
                    />
                    <TextField id="outlined-basic"
                        label="Sobrenome"
                        variant="outlined"
                        required
                        className='half'
                        autoFocus={true}
                        type='text'
                        value={state.sobrenome}
                        onChange={(e) => setState({ ...state, sobrenome: e.target.value })}
                    />
                    <TextField
                        label="Senha"
                        variant="outlined"
                        required
                        className='half'
                        autoFocus={true}
                        id='senha'
                        error={state.senha != state.senhaConfirmacao}
                        type='password'
                        value={state.senha}
                        onChange={(e) => setState({ ...state, senha: e.target.value })}
                    />
                    <TextField id="outlined-basic"
                        label="E-Mail"
                        variant="outlined"
                        required
                        className='half'
                        autoFocus={true}
                        type='email'
                        value={state.email}
                        onChange={(e) => setState({ ...state, email: e.target.value })}
                    />
                    <TextField
                        label="Confirme a Senha"
                        variant="outlined"
                        required
                        className='half'
                        autoFocus={true}
                        id='senhaConfirmacao'
                        error={state.senha != state.senhaConfirmacao}
                        type='password'
                        value={state.senhaConfirmacao}
                        onChange={(e) => setState({ ...state, senhaConfirmacao: e.target.value })}
                    />
                    <div className="cadastro-formulario-verificaSenha">
                        {state.passwordMatch ? <p /> : <p>Senhas não conferem</p>}
                    </div>
                </div>
                <div className='cadastro-formulario-selectForm'>
                    <FormControl fullWidth>
                        <InputLabel id="selecione">Selecione</InputLabel>
                        <Select
                            required
                            labelId="selecione"
                            id="selecione"
                            label="Selecione"
                            value={state.grupo}
                            onChange={(e) => setState({ ...state, grupo: e.target.value })}
                            MenuProps={MenuProps}
                        >
                            {state.listaDeGrupos.map((e) => {
                                return <MenuItem key={e} value={e}>{e}</MenuItem>

                            })}
                        </Select>
                    </FormControl>
                </div>
                <div className='cadastro-formulario-enviarForm'>
                    {status.loading ?
                        <LoadingButton
                            loading
                            variant="contained"
                            startIcon={<SaveIcon />}
                        ></LoadingButton> :
                        <Button
                            type="submit"
                            form="cadastroForm"
                            variant="contained"
                        >Cadastrar
                        </Button>
                    }
                </div>
            </form>
        </Fragment>
    )
}