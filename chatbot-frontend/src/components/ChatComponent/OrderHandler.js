import React, { useEffect, useState } from "react";
import axios from "axios";
import { validateOrderNumber } from "../../components/Utils/Utils";
import OrderStatusMessage from "./OrderStatusMessage";

const OrderHandler = ({ steps, triggerNextStep }) => {
    // Extract order number from previous steps and initialize state variables
    const orderNumber = steps.orderNumber.value;
    const [orderDetails, setOrderDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Reset order details
        setOrderDetails(null);

        const fetchOrderStatus = async () => {
            try {
                // Validate order number
                if (!validateOrderNumber(orderNumber)) {
                    setErrorMessage("Please provide a valid order number (e.g., ORD1234).");
                    return;
                } else {
                    // Send request to backend to track the order
                    const response = await axios.post(
                        "https://chatbot-backend-vert.vercel.app/api/dialogflow",
                        {
                            message: `TRACK_ORDER: ${orderNumber}`,
                            sessionId: localStorage.getItem("sessionId") || null,
                        }
                    );
                    // Update session ID in local storage
                    localStorage.setItem("sessionId", response.data.sessionId);

                    // Parse the order data from the response
                    const orderData = JSON.parse(
                        response.data.fulfillmentText.orderStatus
                    );
                    
                    // If orderData is null, display an error message
                    if (orderData === null) {
                        setErrorMessage("Order not found. Please check the order number or try again.");
                        return;
                    }

                    // Update order details state and trigger display of order status
                    setOrderDetails(orderData);
                    triggerNextStep({
                        value: "----------END OF RESULT----------",
                        trigger: "displayOrderStatus",
                    });
                }
            } catch (error) {
                // Handle errors by displaying an error message in the chatbot
                triggerNextStep({
                    value: "There was an error processing your request. Please try again later.",
                    trigger: "displayOrderStatus",
                });
            }
        };

        // Invoke the fetchOrderStatus function
        fetchOrderStatus();
    }, [orderNumber, triggerNextStep]);

    // Effect hook to trigger the display of error messages
    useEffect(() => {
        if (errorMessage) {
            triggerNextStep({
                value: errorMessage,
                trigger: "displayOrderStatus",
            });
        }
    }, [errorMessage, triggerNextStep]);

    // Render the OrderStatusMessage component with the orderDetails state
    return (
        <div>
            <OrderStatusMessage orderData={orderDetails} />
        </div>
    );
};

export default OrderHandler;
