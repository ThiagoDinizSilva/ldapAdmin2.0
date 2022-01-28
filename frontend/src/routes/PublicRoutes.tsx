import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Login } from '../pages/Login';

export const PublicRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

