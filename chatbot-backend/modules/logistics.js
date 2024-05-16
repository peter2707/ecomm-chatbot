const database = require("./database"); // Import your database module

async function fetchOrderStatus(trackingNumber) {
    try {
        const order = await database.getOrderDetailsByTrackingNumber(
            trackingNumber
        );

        if (order) {
            const status = order.shippingStatus;
            const estimatedDelivery = order.logisticData.estimatedDelivery
                ? new Date(
                      order.logisticData.estimatedDelivery
                  ).toLocaleDateString()
                : "Unknown";

            return `Your order with tracking number ${trackingNumber} is currently **${status}**. Estimated delivery date: **${estimatedDelivery}**.`;
        } else {
            return "Tracking number not found.";
        }
    } catch (error) {
        console.error("Error fetching order status:", error);
        return "An error occurred while tracking your order. Please try again later.";
    }
}

module.exports = { fetchOrderStatus };
