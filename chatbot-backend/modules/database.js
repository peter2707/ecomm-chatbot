const MongoClient = require('mongodb').MongoClient;

const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Functions for database interactions
async function getOrderDetails(orderId) {

}

module.exports = { 
    connect,
    getOrderDetails,
};