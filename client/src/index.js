import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import history from './history'
import Login from './components/Login'
import isAuthenticated from './ProtectedRoute'

import './index.css'
import App from './App';
ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Routes>
        <Route exact path='/' element={isAuthenticated ? <App /> : <Navigate replace to='/login' />} />
        <Route exact path='/login' element={<Login />} />
        <Route path='/' element={() => { return (<h2>404</h2>) }} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
