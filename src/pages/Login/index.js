import React, { useState } from 'react';
import styled from '../../assets/styles/login.module.scss'
import { Button, Input } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../context/auth';

function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState({ loading: false, error: "" });
    const context = useAuth();

    const handleSignIn = async e => {
        try {
            e.preventDefault();
            setStatus({ loading: true })
            const response = await context.Login(user, password)
            if (response.status) {
                window.location.reload();
            } else {
                throw new Error(response);
            }
        } catch (err) {
            setStatus({ ...status, loading: false })
            console.log(err)
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
            </div>
            <form id="loginForm"
                className={styled.loginForm}
                onSubmit={handleSignIn}>
                <div>

                    <Input
                        onChange={(event) => setUser(event.target.value)}
                        valoe={user}
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
                </div>
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
    );
}

export default Login;