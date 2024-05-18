const database = require('./database');

async function checkRefundEligibility(orderId) {
    try {
        const orderData = await database.getOrderStatus(orderId);
        if (!orderData) {
            return null; // Order not found
        }

        const order = JSON.parse(orderData); // Parse the order data 

        const today = new Date();
        const orderDate = new Date(order.orderDate);
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
            database.updateRefundRequested(orderId);
            return "processed";
        } else {
            return "not eligible";
        }
    } catch (error) {
        console.error("Error checking refund eligibility:", error);
        throw error;
    }
}

module.exports = { checkRefundEligibility };