const database = require('./database');

async function checkRefundEligibility(orderId) {
    try {
        // Retrieve order data from the database using the provided order ID
        const orderData = await database.getOrderStatus(orderId);

        // If order not found return null
        if (!orderData) {
            return null;
        }

        // Parse the order data from JSON format
        const order = JSON.parse(orderData);

        // Calculate the difference in days between the current date and the order date
        const today = new Date();
        const orderDate = new Date(order.orderDate);
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If the order was placed within the last 7 days, update refund status and return "processed"
        if (diffDays <= 7) {
            database.updateRefundRequested(orderId);
            return "processed";
        } else {
            // If the order was placed more than 7 days ago, return "not eligible"
            return "not eligible";
        }
    } catch (error) {
        console.error("Error checking refund eligibility:", error);
        throw error;
    }
}

module.exports = { checkRefundEligibility };
