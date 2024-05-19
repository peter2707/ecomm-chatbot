import React, { useEffect } from "react";
import axios from 'axios';

const IssueHandler = ({ steps, triggerNextStep }) => {
    const issueDetails = steps.issueDetails.value;

    useEffect(() => {
        // Function to handle issue escalation
        const escalateIssue = async () => {
            try {
                // Send issue details to backend for escalation
                const response = await axios.post('https://chatbot-backend-vert.vercel.app/api/dialogflow', {
                    message: `ESCALATE_ISSUE: ${issueDetails}`,
                    sessionId: localStorage.getItem('sessionId') || null
                });
                // Update session ID in local storage
                localStorage.setItem('sessionId', response.data.sessionId);
                // Trigger display of issue status in the chatbot
                triggerNextStep({ value: response.data.fulfillmentText, trigger: 'displayIssueStatus' });
            } catch (error) {
                console.error('Error escalating issue:', error);
                triggerNextStep({ value: "There was an error processing your request. Please try again later.", trigger: 'displayIssueStatus' });
            }
        };

        // Invoke the issue escalation function
        escalateIssue();
    }, [issueDetails, triggerNextStep]);

    // Render a message indicating that the issue is being escalated
    return <span>Escalating your issue...</span>;
};

export default IssueHandler;
