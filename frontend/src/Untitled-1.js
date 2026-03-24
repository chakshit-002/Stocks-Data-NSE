src/components/HomePage.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment';

const DEFAULT_STOCKS = ['RELIANCE', 'BEL', 'HAL', 'TCS', 'HDFCBANK', 'INFY'];

const HomePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);

    // Form for bulk save
    const { register: registerBulk, handleSubmit: handleSubmitBulk, formState: { errors: errorsBulk } } = useForm();
    // Form for stock-only search
    const { register: registerStock, handleSubmit: handleSubmitStock, formState: { errors: errorsStock } } = useForm();
    // Form for on-demand search
    const { register: registerOnDemand, handleSubmit: handleSubmitOnDemand, formState: { errors: errorsOnDemand } } = useForm();

    // Bulk save handler for default stocks
    const handleBulkSave = async (data) => {
        setLoading(true);
        const dates = data.dates.split(',').map(d => d.trim()).filter(d => d);
        try {
            const response = await axios.post('http://localhost:3001/api/bulk-save', { dates });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save data.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for the stock-only search
    const handleStockSearch = (data) => {
        navigate(`/stocks/${data.symbol}`);
    };

    // Handler for on-demand fetch and save
    const handleOnDemandSearch = async (data) => {
        const { symbol, date } = data;
        setFetchedData(null);
        setLoading(true);

        // Inside the handleOnDemandSearch async function

        try {
            const response = await axios.get(`http://localhost:3001/api/fetch-nse?symbol=${symbol}&date=${date}`);
            setFetchedData(response.data.data);
            toast.success(`Data fetched for ${symbol} on ${moment(date, 'DDMMYYYY').format('DD-MM-YYYY')}`);
        } catch (error) {
            // Check for a 404 status specifically
            if (error.response && error.response.status === 404) {
                toast.error(`No data found for ${symbol} on ${moment(date, 'DDMMYYYY').format('DD-MM-YYYY')}. It might be a market holiday or a weekend.`);
            } else {
                toast.error(error.response?.data?.error || 'Failed to fetch data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handler for the "Save" button
    const handleSaveFetchedData = async () => {
        try {
            const dataToSave = {
                ...fetchedData,
                date: moment(new Date()).format('YYYY-MM-DD')
            };
            const response = await axios.post('http://localhost:3001/api/save-stock', dataToSave);
            toast.success(response.data.message);
            setFetchedData(null); // Clear fetched data from UI
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save data.');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Bulk Data Save</h2>
                <form onSubmit={handleSubmitBulk(handleBulkSave)}>
                    <div className="form-group">
                        <label>Enter Dates (comma separated, DDMMYYYY format)</label>
                        <input
                            type="text"
                            {...registerBulk('dates', { required: 'Dates are required' })}
                            placeholder="e.g., 21092025,20092025"
                        />
                        {errorsBulk.dates && <p style={{ color: 'red' }}>{errorsBulk.dates.message}</p>}
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Default Stocks Data'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="form-container">
                <h2>Search Stock by Symbol</h2>
                <form onSubmit={handleSubmitStock(handleStockSearch)}>
                    <div className="form-group">
                        <label>Stock Symbol</label>
                        <input
                            type="text"
                            {...registerStock('symbol', { required: 'Symbol is required' })}
                            placeholder="e.g., RELIANCE"
                        />
                        {errorsStock.symbol && <p style={{ color: 'red' }}>{errorsStock.symbol.message}</p>}
                    </div>
                    <div className="form-group">
                        <button type="submit">Search Stock</button>
                    </div>
                </form>
            </div>

            <div className="form-container">
                <h2>On-Demand Fetch and Save</h2>
                <form onSubmit={handleSubmitOnDemand(handleOnDemandSearch)}>
                    <div className="form-group">
                        <label>Stock Symbol</label>
                        <input type="text" {...registerOnDemand('symbol', { required: 'Symbol is required' })} />
                        {errorsOnDemand.symbol && <p style={{ color: 'red' }}>{errorsOnDemand.symbol.message}</p>}
                    </div>
                    <div className="form-group">
                        <label>Date (DDMMYYYY)</label>
                        <input type="text" {...registerOnDemand('date', { required: 'Date is required' })} />
                        {errorsOnDemand.date && <p style={{ color: 'red' }}>{errorsOnDemand.date.message}</p>}
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Fetching...' : 'Fetch Data from NSE'}
                        </button>
                    </div>
                </form>
            </div>

            {fetchedData && (
                <div className="card">
                    <h3>Fetched Data</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Open - Close</th>
                                    <th>High - Low</th>
                                    <th>Delivery ( lakhs ) </th>
                                    <th>Volume</th>
                                    <th>Delivery(%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{fetchedData.symbol}</td>
                                    <td>{fetchedData.open} -- {fetchedData.close}</td>
                                    <td>{fetchedData.high} -- {fetchedData.low}</td>
                                    <td>{fetchedData.delivery ? (fetchedData.delivery / 100000).toFixed(2) : 'N/A'}</td>
                                    <td>{fetchedData.volume}</td>
                                    <td>{fetchedData.delivPercent ? fetchedData.delivPercent.toFixed(2) : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button onClick={handleSaveFetchedData} style={{ marginTop: '10px', backgroundColor: '#007bff' }}>
                        Save to Database
                    </button>
                </div>
            )}

            <div className="card">
                <h2>Default Stocks</h2>
                <p>These are the stocks that will be saved in bulk:</p>
                <ul>
                    {DEFAULT_STOCKS.map((stock, index) => (
                        <li key={index}>{stock}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HomePage;
