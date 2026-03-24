// import React from 'react'
// import { Route, Router, Routes } from 'react-router-dom'
// import HomePage from '../components/HomePage'
// import StockDetails from '../components/StockDetails'
// import Header from '../components/Header'
// import { Toaster } from 'react-hot-toast'

// const Mainroutes = () => {
//     return (
//         <div>
//             <Header />
//             <Toaster position="top-right" />
//             <Routes>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/stocks/:symbol" element={<StockDetails />} />
//             </Routes>
//         </div>
//     )
// }

// export default Mainroutes

// src/Mainroutes.jsx (Updated)
import React from 'react'
import { Route, Routes } from 'react-router-dom' // Router import hata diya, use Routes only
import HomePage from '../components/HomePage'
import StockDetails from '../components/StockDetails'
import WatchlistManager from '../components/WatchlistManager' // WatchlistManager import kiya
import Header from '../components/Header'
import { Toaster } from 'react-hot-toast'

const Mainroutes = () => {
    return (
        <div>
            <Header />
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stocks/:symbol" element={<StockDetails />} />
                
                <Route path="/watchlists" element={<WatchlistManager />} /> {/* New route for watchlists */}
            </Routes>
        </div>
    )
}

export default Mainroutes;