const axios = require('axios');

async function fetchOrderStatus(trackingNumber) {
    try {
        // logic for fetch status from logistic API

        return 'Order Status: ...';
    } catch (error) {
        console.error("Error fetching tracking status:", error);
        throw error;
    }
}

module.exports = { fetchOrderStatus };