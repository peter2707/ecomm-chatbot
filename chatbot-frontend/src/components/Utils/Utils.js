// utils.js
export function validateOrderNumber(orderNumber) {
    const orderNumberRegex = /^ORD\d{4}$/;              //regex to validate order number (ORD1000)
    return orderNumberRegex.test(orderNumber);
}
