// pages/api/currency-conversion.js
import axios from 'axios'; // Import axios for making HTTP requests

// Define the base URL for CoinGecko API's simple price endpoint
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

// Export the default async handler function for the API route
export default async function handler(req, res) {
    // Check if the request method is POST
    // Only allow POST requests to this endpoint
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    // Destructure required parameters from the request body
    const { amount, fromCurrency, toCurrency } = req.body;
    
    // Validate that all required parameters are present
    if (!amount || !fromCurrency || !toCurrency) {
        return res.status(400).json({ 
            error: 'Missing required parameters' 
        });
    }
    
    try {
        // Make GET request to CoinGecko API using axios
        const response = await axios.get(COINGECKO_URL, {
            params: {
                // CoinGecko expects lowercase currency IDs
                ids: fromCurrency.toLowerCase(),         // Source currency
                vs_currencies: toCurrency.toLowerCase(), // Target currency
            },
        });
        
        // Extract exchange rate from response data
        // Data structure: { [fromCurrency]: { [toCurrency]: rate } }
        const exchangeRate = response.data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
        
        // Check if exchange rate exists for the given currency pair
        if (!exchangeRate) {
            return res.status(400).json({ 
                error: 'Invalid currency pair' 
            });
        }
        
        // Calculate converted amount by multiplying input amount with exchange rate
        const convertedAmount = amount * exchangeRate;
        
        // Return successful response with conversion details
        res.status(200).json({ 
            fromCurrency, 
            toCurrency, 
            amount, 
            convertedAmount 
        });
    } catch (error) {
        // Handle any errors (network issues, API errors, etc.)
        res.status(500).json({ 
            error: 'Failed to fetch exchange rate' 
        });
    }
}