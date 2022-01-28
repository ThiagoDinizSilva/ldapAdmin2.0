import React, { useState } from 'react';
import '../../assets/styles/login.scss'
import { Button, Input } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../context/auth';

export const Login: React.FC = () => {

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState({ loading: false, error: "" });
    const context = useAuth();

    const handleSignIn = async e => {
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
        <div className='mainDiv'>
            <div>
                <div className='loginFormImgDiv'>
                    <img src='/esao.png' />
                    <div />
                </div>
            </div>
            <form id="loginForm"
                className='loginForm'
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
    );
}