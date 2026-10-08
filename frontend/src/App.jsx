import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


const App = () => {
  return <Routes>
    <Route path='/login' element={<Login/>}></Route>

    <Route path='/dashboard' element={<Dashboard/>}></Route>

    <Route path='*' element={<Navigate to='/login' replace/>}></Route>

  </Routes>
};

export default App;
