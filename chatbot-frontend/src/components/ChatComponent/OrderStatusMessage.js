import React from 'react';

const OrderStatusMessage = ({ orderData }) => {
    // If orderData is not available yet, display a loading message
    if (!orderData) {
        return <div>Fetching order details...</div>;
    }

    // Destructure orderData to extract relevant information
    const { orderId, customer, shippingStatus, trackingNumber, items } = orderData;

    // Render the order status details
    return (
        <div style={{textAlign: "left"}}>
            <h2>Order Status</h2>
            <p><strong>Order Number:</strong> {orderId}</p>
            <p><strong>Name:</strong> {customer ? customer.name : 'N/A'}</p>
            <p><strong>Shipping Status:</strong> {shippingStatus}</p>
            <p><strong>Tracking Number:</strong> {trackingNumber}</p>
            <p><strong>Items:</strong></p>
            <ul>
                {/* Display each item */}
                {items.map((item, index) => (
                    <li key={index}>{item.name} (x{item.quantity})</li>
                ))}
            </ul>
        </div>
    );
};

export default OrderStatusMessage;
