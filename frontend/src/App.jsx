import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import StockDetails from './components/StockDetails';
import Header from './components/Header';
import './App.css'; // Import the CSS file
import Mainroutes from './Routes/Mainroutes';
import KeepAlive from './components/KeepAlive';

function App() {
    return (
        <div className=' min-h-screen bg-[#0f172a] text-slate-200'>
            <Header />
            <Toaster position="top-right" />
            {/* <KeepAlive/> */}
            <Mainroutes />
        </div>
    );
}

export default App;