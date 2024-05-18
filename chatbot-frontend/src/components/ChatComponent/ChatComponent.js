import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import OrderHandler from "./OrderHandler";
import RefundHandler from "./RefundHandler";
import IssueHandler from "./IssueHandler";

// Define the theme for the chatbot
const theme = {
    background: "#f5f8fb",
    fontFamily: "Arial, Helvetica, sans-serif",
    headerBgColor: "#5AB2FF",
    headerFontColor: "#fff",
    headerFontSize: "20px",
    botBubbleColor: "#5AB2FF",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
};

const ChatComponent = () => {
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [orderPrompt, setOrderPrompt] = useState("");
    const [refundPrompt, setRefundPrompt] = useState("");
    const [issuePrompt, setIssuePrompt] = useState("");

    useEffect(() => {
        const fetchWelcomeMessage = async () => {
            try {
                const response = await axios.post(
                    "https://chatbot-backend-vert.vercel.app/api/dialogflow",
                    {
                        message: "INIT",
                        sessionId: localStorage.getItem("sessionId") || null,
                    }
                );
                setWelcomeMessage(response.data.fulfillmentText);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching welcome message:", error);
                setIsLoading(false);
            }
        };

        fetchWelcomeMessage();
    }, []);

    useEffect(() => {
        const fetchOrderPrompt = async () => {
            try {
                const response = await axios.post(
                    "https://chatbot-backend-vert.vercel.app/api/dialogflow",
                    {
                        message: "TRACK_ORDER",
                        sessionId: localStorage.getItem("sessionId") || null,
                    }
                );
                setOrderPrompt(response.data.fulfillmentText);
            } catch (error) {
                console.error("Error fetching order prompt:", error);
            }
        };

        const fetchRefundPrompt = async () => {
            try {
                const response = await axios.post(
                    "https://chatbot-backend-vert.vercel.app/api/dialogflow",
                    {
                        message: "REQUEST_REFUND",
                        sessionId: localStorage.getItem("sessionId") || null,
                    }
                );
                setRefundPrompt(response.data.fulfillmentText);
            } catch (error) {
                console.error("Error fetching refund prompt:", error);
            }
        };

        const fetchIssuePrompt = async () => {
            try {
                const response = await axios.post(
                    "https://chatbot-backend-vert.vercel.app/api/dialogflow",
                    {
                        message: "ESCALATE_ISSUE",
                        sessionId: localStorage.getItem("sessionId") || null,
                    }
                );
                setIssuePrompt(response.data.fulfillmentText);
            } catch (error) {
                console.error("Error fetching issue prompt:", error);
            }
        };

        fetchOrderPrompt();
        fetchRefundPrompt();
        fetchIssuePrompt();
    }, []);

    // Define the steps for the chatbot
    const steps = [
        {
            id: "1",
            message: isLoading ? "Loading..." : welcomeMessage,
            trigger: "options",
        },
        {
            id: "options",
            options: [
                {
                    value: "trackOrder",
                    label: "Track Order",
                    trigger: "askOrderNumber",
                },
                {
                    value: "refundRequest",
                    label: "Request a Refund",
                    trigger: "askRefundOrderNumber",
                },
                {
                    value: "escalateIssue",
                    label: "Escalate Issue",
                    trigger: "askIssueDetails",
                },
            ],
        },
        {
            id: "askOrderNumber",
            message:
                orderPrompt ||
                "Please provide your order number (e.g., ORD1234).",
            trigger: "orderNumber",
        },
        {
            id: "orderNumber",
            user: true,
            trigger: "handleOrderNumber",
        },
        {
            id: "handleOrderNumber",
            component: <OrderHandler />,
            asMessage: true,
            waitAction: true,
        },
        {
            id: "displayOrderStatus",
            message: ({ previousValue }) => previousValue,
            trigger: "anythingElse",
        },
        {
            id: "askRefundOrderNumber",
            message:
                refundPrompt ||
                "Please provide your order number for the refund request (e.g., ORD1234).",
            trigger: "refundOrderNumber",
        },
        {
            id: "refundOrderNumber",
            user: true,
            trigger: "handleRefundOrderNumber",
        },
        {
            id: "handleRefundOrderNumber",
            component: <RefundHandler />,
            asMessage: true,
            waitAction: true,
        },
        {
            id: "displayRefundStatus",
            message: ({ previousValue }) => previousValue,
            trigger: "anythingElse",
        },
        {
            id: "askIssueDetails",
            message: issuePrompt || "Please describe the issue you are facing.",
            trigger: "issueDetails",
        },
        {
            id: "issueDetails",
            user: true,
            trigger: "handleIssueDetails",
        },
        {
            id: "handleIssueDetails",
            component: <IssueHandler />,
            asMessage: true,
            waitAction: true,
        },
        {
            id: "displayIssueStatus",
            message: ({ previousValue }) => previousValue,
            trigger: "anythingElse",
        },
        {
            id: "anythingElse",
            message: "Is there anything else I can assist you with?",
            trigger: "anythingElseOptions",
        },
        {
            id: "anythingElseOptions",
            options: [
                { value: "yes", label: "Yes", trigger: "options" },
                { value: "no", label: "No", trigger: "endMessage" },
            ],
        },
        {
            id: "endMessage",
            message: "Thank you! Have a great day!",
            end: true,
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            {isLoading ? <div>Loading...</div> : <ChatBot steps={steps} />}
        </ThemeProvider>
    );
};

export default ChatComponent;
