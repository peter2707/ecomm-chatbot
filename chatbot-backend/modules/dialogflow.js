const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, '../dialogflow-credentials.json')
});

async function sendToDialogflow(message, sessionId) {
    const sessionPath = sessionClient.projectAgentSessionPath(
        'ecomm-chatbot-io',
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US'
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    return {
        intent: result.intent.displayName,
        entities: result.parameters.fields,
        fulfillmentText: result.fulfillmentText
    };
}

module.exports = { sendToDialogflow };
