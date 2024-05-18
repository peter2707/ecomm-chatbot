import React, { useEffect, useState } from "react";
import axios from 'axios';

const OrderHandler = ({ steps, triggerNextStep }) => {
    const orderNumber = steps.orderNumber.value;
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Clear previous order details
        setOrderDetails(null);

        const fetchOrderStatus = async () => {
            try {
                console.log('Fetching order status for:', orderNumber);
                const response = await axios.post('https://chatbot-backend-vert.vercel.app/api/dialogflow', {
                    message: `Track Order: ${orderNumber}`,
                    sessionId: localStorage.getItem('sessionId') || null
                });
                localStorage.setItem('sessionId', response.data.sessionId);
                console.log('Response data:', response.data);

                // Extract and parse the embedded JSON from the fulfillmentText
                const orderDataString = response.data.fulfillmentText.match(/\{.*\}/)[0];
                const orderData = JSON.parse(orderDataString);
                console.log('Parsed order data:', orderData);

                setOrderDetails(orderData);

                const orderStatusMessage = `
                    Order Number: ${orderData.orderId}
                    Customer Name: ${orderData.customer.name}
                    Shipping Status: ${orderData.shippingStatus}
                    Tracking Number: ${orderData.trackingNumber}
                    Items: ${orderData.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                `;
                console.log('Order status message:', orderStatusMessage);
                triggerNextStep({ value: orderStatusMessage, trigger: 'displayOrderStatus' });
            } catch (error) {
                console.error('Error fetching order status:', error);
                triggerNextStep({ value: "There was an error processing your request. Please try again later.", trigger: 'displayOrderStatus' });
            }
        };

        fetchOrderStatus();
    }, [orderNumber, triggerNextStep]);

    return (
        <span>
            {orderDetails ? 'Fetching order details...' : 'Checking your order status...'}
        </span>
    );
};

export default OrderHandler;