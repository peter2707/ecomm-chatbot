const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const dialogflow = require('./modules/dialogflow');
const logistics = require('./modules/logistics');
const refunds = require('./modules/refunds');
const database = require('./modules/database');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.post('/api/dialogflow', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || uuidv4();

    try {
        const dialogflowResponse = await dialogflow.sendToDialogflow(userMessage, sessionId);
        const intent = dialogflowResponse.intent;
        const entities = dialogflowResponse.entities;
        const outputContexts = dialogflowResponse.outputContexts || [];

        if (intent === 'ProvideOrderTrackingNumber') {
            // User provided an order number
            const orderNumber = entities.orderNumber.stringValue;
            if (validateOrderNumber(orderNumber)) {
                const orderStatus = await database.getOrderStatus(orderNumber);
                const fulfillmentResponse = {
                    fulfillmentText: `${orderStatus}.\nIs there anything else I can assist you with?`,
                    sessionId: sessionId
                };
                res.json(fulfillmentResponse);
            } else {
                const fulfillmentResponse = {
                    fulfillmentText: 'Please provide a valid order number (e.g., ORD1234).',
                    sessionId: sessionId
                };
                res.json(fulfillmentResponse);
            }
        } else if (intent === 'RefundRequest') {
            // User provided an order number for refund
            const orderNumber = entities.orderNumber.stringValue;
            if (validateOrderNumber(orderNumber)) {
                const refundStatus = await refunds.checkRefundEligibility(orderNumber);
                const fulfillmentResponse = {
                    fulfillmentText: refundStatus ? `Your refund request for order ${orderNumber} is ${refundStatus}.` : `Refund requests must be made within 7 days of the order date.`,
                    sessionId: sessionId
                };
                res.json(fulfillmentResponse);
            } else {
                const fulfillmentResponse = {
                    fulfillmentText: 'Please provide a valid order number (e.g., ORD1234).',
                    sessionId: sessionId
                };
                res.json(fulfillmentResponse);
            }
        } else if (intent === 'EscalateToHuman') {
            const issue = entities.issue.stringValue;
            const escalationResponse = await handleEscalation(issue);
            const fulfillmentResponse = {
                fulfillmentText: escalationResponse,
                sessionId: sessionId
            };
            res.json(fulfillmentResponse);
        } else {
            // Default response for unhandled intents
            const fulfillmentResponse = {
                fulfillmentText: dialogflowResponse.fulfillmentText || "Unhandled Intent.",
                sessionId: sessionId
            };
            res.json(fulfillmentResponse);
        }
    } catch (error) {
        console.error("Error processing Dialogflow request:", error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

// Escalation logic
async function handleEscalation(issue) {
    return "We've escalated your issue. A human agent will contact you shortly.";
}

// Helper function to validate order number format
function validateOrderNumber(orderNumber) {
    const orderNumberRegex = /^[A-Z]{3}\d{4}$/;
    return orderNumberRegex.test(orderNumber);
}

// Start server and connect to database
database.connect().then(() => {
    app.listen(port, () => {
        console.log(`Backend server is running on port ${port}`);
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
