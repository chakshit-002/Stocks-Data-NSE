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
        <div>
            <Header />
            <Toaster position="top-right" />
            <KeepAlive/>
            <Mainroutes />
        </div>
    );
}

export default App;