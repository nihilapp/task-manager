import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages';

import './styles/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from './layouts';

const root = document.getElementById('root') as HTMLElement;

const routerApp = (
  <Providers>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </Providers>
);

ReactDOM.createRoot(root).render(routerApp);
