import React, { useState } from 'react';
import api from "../../services/api";
import { Autenticar } from "../../services/auth";
import { useNavigate } from 'react-router-dom';
import styled from '../../assets/styles/login.module.scss'
import { Button, Input } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

function Login() {
    const history = useNavigate;
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState({ loading: false, error: "" });

    const handleSignIn = async e => {
        try {
            e.preventDefault();
            setStatus({ loading: true })
            await api.post("/auth/login", { login, password })
                .then((response) => {
                    if (!response.data.status) {
                        setStatus({ loading: false, error: response.data.error })
                        setLogin("");
                        setPassword("");
                    } else if (response.data.status) {
                        Autenticar(response.data.token);
                        window.location.reload();
                        history.push({
                            pathname: "/dashboard",
                        })

                    }
                });
        } catch (err) {
            alert(err.message);
        }
    };
    return (
        <div className={styled.mainDiv}>
            <div>
                <div className={styled.loginFormImgDiv}>
                    <img src='/esao.png' />
                    <div />
                </div>
                <form id="loginForm"
                    className={styled.loginForm}
                    onSubmit={handleSignIn}>
                    <Input
                        onChange={(event) => setLogin(event.target.value)}
                        valoe={login}
                        placeholder='Identidade'
                        type='text'
                        required
                    />
                    <Input
                        onChange={(event) => setPassword(event.target.value)}
                        valoe={password}
                        placeholder='Senha'
                        type='password'
                        required
                    />
                    {status.loading ?
                        <LoadingButton
                            loading
                            variant="outlined"
                            startIcon={<SaveIcon />}
                        ></LoadingButton> :
                        <Button
                            type="submit"
                            form="loginForm"
                            variant='outlined'
                        >Login
                        </Button>
                    }


                </form>
            </div>
        </div>
    );
}

export default Login;