// pages/api/check-wallet.js
// Importing axios library for making HTTP requests
import axios from 'axios';

// API key for Etherscan (should be replaced with actual key)
const ETHERSCAN_API_KEY = 'YOUR_ETHERSCAN_API_KEY'; 
// Base URL for Etherscan API
const ETHERSCAN_URL = 'https://api.etherscan.io/api';

// Exporting default async function handler for API route
export default async function handler(req, res) {
    // Check if request method is POST, return error if not
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    // Destructure walletAddress from request body
    const { walletAddress } = req.body;
    // Validate that walletAddress is provided
    if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Regular expression to validate Ethereum address format:
    // - Starts with "0x"
    // - Followed by 40 hexadecimal characters
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid wallet address' });
    }
    
    // Try-catch block for handling API request
    try {
        // Make GET request to Etherscan API
        const response = await axios.get(ETHERSCAN_URL, {
            params: {
                module: 'account',        // Etherscan module for account-related queries
                action: 'balance',        // Specific action to get balance
                address: walletAddress,   // Wallet address to check
                tag: 'latest',           // Get latest balance
                apikey: ETHERSCAN_API_KEY // Authentication key
            },
        });
        
        // Convert balance from Wei (smallest ETH unit) to ETH by dividing by 10^18
        const balance = response.data.result / 1e18;
        // Return successful response with wallet address and balance
        res.status(200).json({ walletAddress, balance });
    } catch (error) {
        // Handle any errors from API request
        res.status(500).json({ error: 'Failed to fetch wallet balance' });
    }
}