const MongoClient = require("mongodb").MongoClient;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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
async function getOrderDetailsByTrackingNumber(trackingNumber) {
    try {
        const order = await client
            .db("ecomm-chatbot")
            .collection("Order")
            .findOne({ trackingNumber: trackingNumber });
        return order;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
}

module.exports = {
    connect,
    getOrderDetailsByTrackingNumber,
};
