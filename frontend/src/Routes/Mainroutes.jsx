
import React from 'react'
import { Route, Routes } from 'react-router-dom' // Router import hata diya, use Routes only
import HomePage from '../components/HomePage'
import StockDetails from '../components/StockDetails'
import WatchlistManager from '../components/WatchlistManager' // WatchlistManager import kiya

const Mainroutes = () => {
    return (
        <div>
          
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stocks/:symbol" element={<StockDetails />} />
                
                <Route path="/watchlists" element={<WatchlistManager />} /> {/* New route for watchlists */}
            </Routes>
        </div>
    )
}

export default Mainroutes;