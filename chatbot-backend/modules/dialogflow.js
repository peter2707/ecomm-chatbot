const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, '../dialogflow-credentials.json')
});

async function sendToDialogflow(message) {
    // Construct request
    const sessionPath = sessionClient.projectAgentSessionPath(
        'project-id',
        'unique-session-id'
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent:', responses[0].queryResult.intent.displayName);

    // Extract intent and entities 
    return {
        intent: responses[0].queryResult.intent.displayName,
        entities: responses[0].queryResult.parameters.fields 
    };
}

module.exports = { sendToDialogflow };