const MongoClient = require("mongodb").MongoClient;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Functions for database interactions
async function getOrderStatus(orderId) {
    try {
        const order = await client
            .db("ecomm-chatbot")
            .collection("Order")
            .findOne({ orderId: orderId });
        return JSON.stringify(order);
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
}

// Function to update the refundRequested status in the database
async function updateRefundRequested(orderId) {
    try {
        await client
            .db("ecomm-chatbot")
            .collection("Order").updateOne(
                { orderId: orderId },
                { $set: { refundRequested: true } }
            );
    } catch (error) {
        console.error("Error updating refund requested status:", error);
        throw error;
    }
}

module.exports = {
    connect,
    getOrderStatus,
    updateRefundRequested
};
