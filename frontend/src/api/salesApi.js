import axios from 'axios';

// Correct API URL with versioned path
const API_URL = 'http://localhost:5000/api/v1/sales';
const PRODUCT_API_URL = 'http://localhost:5000/api/v1/products';

export const addSale = async (saleData) => {
    return axios.post(API_URL, saleData);
};

export const getAllSales = async () => {
    return axios.get(API_URL);
};


// API to get product details by product_id
export const getProductByID = async (product_id) => axios.get(`${PRODUCT_API_URL}/products/${product_id}`);

