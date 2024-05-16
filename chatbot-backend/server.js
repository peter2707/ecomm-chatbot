const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const dialogflow = require('./modules/dialogflow'); 
const logistics = require('./modules/logistics');
const refunds = require('./modules/refunds');
const database = require('./modules/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.post('/api/dialogflow', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const dialogflowResponse = await dialogflow.sendToDialogflow(userMessage);
        const intent = dialogflowResponse.intent;
        const entities = dialogflowResponse.entities; 
        // Check if the request has an intent
        if (intent) {
            let fulfillmentResponse; // Dialogflow's response

            switch (intent) {
                case 'OrderStatus':
                    const orderStatus = await logistics.fetchOrderStatus(entities.trackingNumber);
                    fulfillmentResponse = {
                        fulfillmentText: orderStatus 
                    };
                    break;
                case 'RequestRefund':
                    const refundResponse = await refunds.handleRequestRefund(entities); 
                    fulfillmentResponse = {
                        fulfillmentText: refundResponse
                    };
                    break;
                default: 
                    fulfillmentResponse = {
                        fulfillmentText: 'Sorry, I didn\'t understand. Please try rephrasing.'
                    };
            }

            res.json(fulfillmentResponse); // Send response back to Dialogflow

        } else {
            console.log('No intent detected in request.');
            res.status(400).json({ message: 'No intent detected.' });
        }

    } catch (error) {
        console.error("Error processing Dialogflow request:", error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

// Start server and connect to database
database.connect().then(() => {
    app.listen(port, () => {
        console.log(`Backend server is running on port ${port}`);
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});