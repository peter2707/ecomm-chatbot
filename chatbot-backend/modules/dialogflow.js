const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');

const sessionClient = new dialogflow.SessionsClient({
    // Specify the path to the service account key file for authentication
    keyFilename: path.join(__dirname, '../dialogflow-credentials.json')
});

// Function to send a message to Dialogflow and receive a response
async function sendToDialogflow(message, sessionId, inputContexts = null) {
    const sessionPath = sessionClient.projectAgentSessionPath(
        'ecomm-chatbot-io',
        sessionId
    );

    // Construct the request object to send to Dialogflow
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US'
            }
        }
    };

    // If inputContexts are provided, add them to the request object
    if (inputContexts) {
        request.queryParams = { contexts: inputContexts };
    }

    // Send the request to Dialogflow and receive responses
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Extract relevant information from the response
    const dialogflowResponse = {
        intent: result.intent.displayName,
        entities: result.parameters.fields,
        fulfillmentText: result.fulfillmentText,
        outputContexts: result.outputContexts
    };

    return dialogflowResponse;
}

module.exports = { sendToDialogflow };
