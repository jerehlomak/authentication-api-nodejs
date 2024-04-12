const transaction_ref = () => {
    return `tripescape-${Math.random().toString(36).slice(2)}`;
};

module.exports = {
    transaction_ref
}