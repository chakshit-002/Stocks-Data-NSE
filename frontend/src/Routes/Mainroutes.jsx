
import React from 'react'
import { Route, Routes } from 'react-router-dom' // Router import hata diya, use Routes only
import HomePage from '../components/HomePage'
import StockDetails from '../components/StockDetails'
import WatchlistManager from '../components/WatchlistManager' // WatchlistManager import kiya
import Login from '../components/Login'
import Register from '../components/Register'
import PageNotFound from '../components/PageNotFound'
import ProtectedRoute from './ProtectedRotue'

const Mainroutes = () => {
    return (
        <div>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stocks/:symbol" element={<StockDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/watchlists"
                    element={
                        <ProtectedRoute>
                            <WatchlistManager />
                        </ProtectedRoute>
                    }
                /> {/* New route for watchlists */}

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    )
}

export default Mainroutes;