const database = require('./database');

async function checkRefundEligibility(orderId) {
    try {
        await database.connect();
        const order = await database
            .db("ecomm-chatbot")
            .collection("Order")
            .findOne({ orderId: orderId });

        if (!order) {
            return null;
        }

        const today = new Date();
        const orderDate = new Date(order.orderDate);
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
            order.refundRequested = true;
            await database.db("ecomm-chatbot").collection("Order").updateOne(
                { orderId: orderId },
                { $set: { refundRequested: true } }
            );
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
