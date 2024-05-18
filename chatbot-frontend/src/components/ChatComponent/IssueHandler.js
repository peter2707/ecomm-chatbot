import React, { useEffect } from "react";
import axios from 'axios';

const IssueHandler = ({ steps, triggerNextStep }) => {
    const issueDetails = steps.issueDetails.value;

    useEffect(() => {
        const escalateIssue = async () => {
            try {
                const response = await axios.post('https://chatbot-backend-vert.vercel.app/api/dialogflow', {
                    message: `Escalate Issue: ${issueDetails}`,
                    sessionId: localStorage.getItem('sessionId') || null
                });
                localStorage.setItem('sessionId', response.data.sessionId);
                triggerNextStep({ value: response.data.fulfillmentText, trigger: 'displayIssueStatus' });
            } catch (error) {
                console.error('Error escalating issue:', error);
                triggerNextStep({ value: "There was an error processing your request. Please try again later.", trigger: 'displayIssueStatus' });
            }
        };

        escalateIssue();
    }, [issueDetails, triggerNextStep]);

    return <span>Escalating your issue...</span>;
};

export default IssueHandler;