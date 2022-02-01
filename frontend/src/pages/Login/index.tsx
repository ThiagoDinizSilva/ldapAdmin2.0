import React, { useState } from 'react';
import styled from '../../assets/styles/login.module.scss'
import { Button, Input } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../context/auth';
import { GitHub, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
export const Login: React.FC = () => {

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState({ loading: false, error: "" });
    const context = useAuth();

    const handleSignIn = async (e: { preventDefault: () => void; }): Promise<any> => {
        try {
            e.preventDefault();
            setStatus({ loading: true, error: "" })
            const response = await context.Login(user, password)
            window.location.reload();
        } catch (e: any) {
            setStatus({ ...status, loading: false, error: e.response.data.message })
            // alert(response.data.message);
        }
    };
    return (
        <>
            <div className={styled.mainDiv}>
                <div>
                    <div className={styled.loginFormImgDiv}>
                        <img src='/logo.png' />
                        <div />
                    </div>
                </div>
                <form id="loginForm"
                    className={styled.loginForm}
                    onSubmit={handleSignIn}>
                    <div>
                        <Input
                            onChange={(event) => setUser(event.target.value)}
                            value={user}
                            placeholder='Identidade'
                            type='text'
                            required
                        />
                        <Input
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                            placeholder='Senha'
                            type='password'
                            required
                        />
                        <div>{status.error ? <p>{status.error}</p> : null}</div>
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
            <div className={styled.contactInfo}>
                <p> Projeto Dryad LdapAdmin2.0 Desenvolvido por Thiago Diniz </p>
                <div>
                    <p>Entre em contato:</p>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/diniz_dev/"><Instagram /></a>
                    <a target="_blank" rel="noreferrer" href="https://twitter.com/diniz_dev"><Twitter /></a>
                    <a target="_blank" rel="noreferrer" href="https://github.com/ThiagoDinizSilva"><GitHub /></a>
                    <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/thiagodinizsilva/"><LinkedIn /></a>
                </div>
            </div>
        </>
    );
}