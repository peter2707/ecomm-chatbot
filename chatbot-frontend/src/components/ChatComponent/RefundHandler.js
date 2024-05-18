import React, { useEffect } from "react";
import axios from 'axios';

const RefundHandler = ({ steps, triggerNextStep }) => {
    const orderNumber = steps.refundOrderNumber.value;

    useEffect(() => {
        const requestRefund = async () => {
            try {
                const response = await axios.post('https://chatbot-backend-vert.vercel.app/api/dialogflow', {
                    message: `Refund Request: ${orderNumber}`,
                    sessionId: localStorage.getItem('sessionId') || null
                });
                localStorage.setItem('sessionId', response.data.sessionId);
                triggerNextStep({ value: response.data.fulfillmentText, trigger: 'displayRefundStatus' });
            } catch (error) {
                console.error('Error requesting refund:', error);
                triggerNextStep({ value: "There was an error processing your request. Please try again later.", trigger: 'displayRefundStatus' });
            }
        };

        requestRefund();
    }, [orderNumber, triggerNextStep]);

    return <span>Processing your refund request...</span>;
};

export default RefundHandler;