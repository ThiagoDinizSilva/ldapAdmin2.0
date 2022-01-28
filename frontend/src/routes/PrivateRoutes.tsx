import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
//import { Home } from '../pages/Home';
import { Usuarios } from '../pages/Usuarios';
import { Cadastro } from '../pages/Cadastro';
import { Grupos } from '../pages/Grupos';
import { UsuarioDetalhes } from '../pages/UsuarioDetalhes';
import { GrupoDetalhes } from '../pages/GrupoDetalhes';

export const PrivateRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/usuarios/:id" element={<UsuarioDetalhes />} />
                    <Route path="/usuarios" element={<Usuarios />}>
                    </Route>
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/grupos/:id" element={<GrupoDetalhes />} />
                    <Route path="/grupos" element={<Grupos />} />
                    <Route
                        path="*"
                        element={<Navigate to="/cadastro" />}
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};

