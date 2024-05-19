import React, { useEffect } from "react";
import axios from 'axios';
import { validateOrderNumber } from "../../components/Utils/Utils";

const RefundHandler = ({ steps, triggerNextStep }) => {
    const orderNumber = steps.refundOrderNumber.value;

    useEffect(() => {
        const requestRefund = async () => {
            try {
                // Validate order number
                if (!validateOrderNumber(orderNumber)) {
                    triggerNextStep({ value: "Please provide a valid order number (e.g., ORD1234).", trigger: "displayRefundStatus" });
                    return;
                } else {
                    // Send refund request to backend
                    const response = await axios.post('https://chatbot-backend-vert.vercel.app/api/dialogflow', {
                        message: `REFUND_REQUEST: ${orderNumber}`,
                        sessionId: localStorage.getItem('sessionId') || null
                    });
                    localStorage.setItem('sessionId', response.data.sessionId);
                    
                    if(response.data.fulfillmentText) {
                        // If fulfillment text is available, display the refund status
                        triggerNextStep({ value: response.data.fulfillmentText, trigger: 'displayRefundStatus' });
                    } else {
                        // If fulfillment text is not available, display an error message
                        triggerNextStep({ value: "Order not found. Please check the order number or try again.", trigger: 'displayRefundStatus' });
                    }
                }
            } catch (error) {
                // Handle errors during refund request
                console.error('Error requesting refund:', error);
                triggerNextStep({ value: "There was an error processing your request. Please try again later.", trigger: 'displayRefundStatus' });
            }
        };

        // Call the refund request function
        requestRefund();
    }, [orderNumber, triggerNextStep]);

    // Render a message while processing the refund request
    return <span>Processing your refund request...</span>;
};

export default RefundHandler;
