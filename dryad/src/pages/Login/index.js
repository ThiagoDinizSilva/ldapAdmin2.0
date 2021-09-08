import React, { useState } from 'react';
import '../../assets/scss/Login.scss'
import api from "../../services/api";
import { autenticar } from "../../services/auth";
import { useHistory } from "react-router";



function Login() {
    const history = useHistory();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSignIn = async e => {
        e.preventDefault();
        setError(null);

        if (!login || !password) {
            setError("Preencha usuario e senha para continuar!");
        } else {
            try {
                await api.post("/auth/login", { login, password })
                    .then((response) => {
                        if (!response.data.status) {
                            setError(response.data.error)
                            setLogin("");
                            setPassword("");
                        } else if (response.data.status) {
                            autenticar(response.data.token);
                            window.location.reload();
                            history.push({
                                pathname: "/dashboard",
                            })

                        }
                    });
            } catch (err) {
                alert(err.message);
            }
        }
    };
    return (
        <div className="mock">
            <div className="login">
                <h1>LdapAdmin</h1>
                <form method="post"
                    className="login-form"
                    onSubmit={handleSignIn}
                >
                    <input type="text"
                        placeholder="Login"
                        required="required"
                        onChange={e => setLogin(e.target.value)}
                        value={login}
                    />
                    <input type="password"
                        placeholder="Senha"
                        required="required"
                        onChange={e => setPassword(e.target.value)}
                        value={password}

                    />
                    {error && <p>{error}</p>}

                    <button type="submit"
                        className="btn-login">
                        Entrar
                    </button>
                </form>
            </div>

        </div>
    );
}

export default Login;