import React, { Fragment, useState } from 'react';
import { Input, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import styled from '../../assets/styles/cadastro.module.scss'
export default function Cadastro() {
    const [resultados, setResultados] = useState([])
    const [state, setState] = useState({
        login: '',
        nome: '',
        sobrenome: '',
        nomeExibicao: '',
        prefixo: '',
        id: '',
        ano: '',
        arma: '',
        curso: ''
    })

    const alunos = <div>
        <FormControl fullWidth>
            <InputLabel id="selecione">Selecione</InputLabel>
            <Select
                labelId="selecione"
                id="selecione"
                label="Selecione"
                value={state.id}
                onChange={(e) => setState({ ...state, id: e.target.value })}
            >
                <MenuItem value='alunos'>Aluno</MenuItem>
                <MenuItem value='eceme'>ECEME</MenuItem>
                <MenuItem value='esao'>Corpo Permanente</MenuItem>
            </Select>
        </FormControl>
    </div>
    const esao = <div>
        <FormControl fullWidth>
            <InputLabel id="selecione">Posto/Graduação</InputLabel>
            <Select
                labelId="selecione"
                id="selecione"
                label="Selecione"
                value={state.id}
                onChange={(e) => setState({ ...state, id: e.target.value })}
            >
                <MenuItem value='alunos'>Aluno</MenuItem>
                <MenuItem value='eceme'>ECEME</MenuItem>
                <MenuItem value='esao'>Corpo Permanente</MenuItem>
            </Select>
        </FormControl>
    </div>

    return (
        <div>
            <form className={styled.formularioCadastro}>
                <div>
                    <Input required
                        className={styled.full}
                        autoFocus={true}
                        placeholder='Identidade'
                        value={state.login}
                        onChange={(e) => setState({ ...state, login: e.target.value })}
                    />
                    <Input required
                        className={styled.half}
                        autoFocus={true}
                        placeholder='Primeiro Nome'
                        value={state.nome}
                        onChange={(e) => setState({ ...state, nome: e.target.value })}
                    />
                    <Input required
                        className={styled.half}
                        autoFocus={true}
                        placeholder='Sobrenome'
                        value={state.sobrenome}
                        onChange={(e) => setState({ ...state, sobrenome: e.target.value })}
                    />

                    <Input required
                        className={styled.half}
                        autoFocus={true}
                        placeholder='Nome de Guerra'
                        value={state.nomeExibicao}
                        onChange={(e) => setState({ ...state, nomeExibicao: e.target.value })}
                    />
                </div>
                <div className={styled.selectForm}>
                    <FormControl fullWidth>
                        <InputLabel id="selecione">Selecione</InputLabel>
                        <Select
                            labelId="selecione"
                            id="selecione"
                            label="Selecione"
                            value={state.id}
                            onChange={(e) => setState({ ...state, id: e.target.value })}
                        >
                            <MenuItem value='alunos'>Aluno</MenuItem>
                            <MenuItem value='eceme'>ECEME</MenuItem>
                            <MenuItem value='esao'>Corpo Permanente</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={styled.hiddenForm}>
                    {state.id == 'alunos' ? { alunos } : null}
                    {state.id == 'esao' ? { esao } : null}
                </div>
            </form>
        </div>
    )
}