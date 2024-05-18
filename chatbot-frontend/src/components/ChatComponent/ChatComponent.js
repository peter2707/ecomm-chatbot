import React from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from 'styled-components';
import OrderHandler from "./OrderHandler";
import RefundHandler from "./RefundHandler";
import IssueHandler from "./IssueHandler";

// Define the theme for the chatbot
const theme = {
    background: '#f5f8fb',
    fontFamily: 'Arial, Helvetica, sans-serif',
    headerBgColor: '#00B2B2',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#00B2B2',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
};

// Define the steps for the chatbot
const steps = [
    {
        id: "1",
        message: "Hi! How can I assist you today?",
        trigger: "options",
    },
    {
        id: "options",
        options: [
            { value: "trackOrder", label: "Track Order", trigger: "askOrderNumber" },
            { value: "refundRequest", label: "Request a Refund", trigger: "askRefundOrderNumber" },
            { value: "escalateIssue", label: "Escalate Issue", trigger: "askIssueDetails" },
        ],
    },
    {
        id: "askOrderNumber",
        message: "Please provide your order number (e.g., ORD1234).",
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
        message: "Please provide your order number for the refund request (e.g., ORD1234).",
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
        message: "Please describe the issue you are facing.",
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

const ChatComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <ChatBot steps={steps} />
        </ThemeProvider>
    );
};

export default ChatComponent;
