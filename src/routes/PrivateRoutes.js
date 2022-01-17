import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Cadastro from '../pages/Cadastro';

import Home from '../pages/Home';
import Permissoes from '../pages/Permissoes';

export default function PrivateRoutes() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/permissoes" element={<Permissoes />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};

