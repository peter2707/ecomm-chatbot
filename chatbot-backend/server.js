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
app.post('/api/sendMessage', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const dialogflowResponse = await dialogflow.sendToDialogflow(userMessage);
        const intent = dialogflowResponse.intent;
        const entities = dialogflowResponse.entities; 

        let chatbotResponse;
        switch (intent) {
            case 'TrackOrder':
                chatbotResponse = await logistics.fetchOrderStatus(entities.trackingNumber);
                break;
            case 'RequestRefund':
                chatbotResponse = await refunds.handleRequestRefund(entities); 
                break;
            
            default: 
                chatbotResponse = 'I am not sure I understand. Can you rephrase?'; 
        }

        res.json({ message: chatbotResponse });

    } catch (error) {
        console.error("Error processing message:", error);
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