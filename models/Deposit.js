const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const depositSchema = Schema(
    {
        tour_Id: {
            type: String,
            // required: [true, 'Please enter a name'],
        },
        name: {
            type: String,
            // required: [true, 'Please enter a name'],
        },
        phone: {
            type: String,
            // required: [true, 'Please enter a target amount'],
        },
        email: {
            type: String,
            // required: [true, 'Please select report interval'],
        },
        amount: {
            type: String,
            // required: [true, 'Please payout option'],
        },
        tx_ref: {
            type: String,
            // required: true,
        },
        transaction_id: {
            type: String,
        }
    },
    {
        timestamps: true,
    },
);

const Deposit = mongoose.model('Deposit', depositSchema);

module.exports = Deposit; 