const { transaction_ref } = require('../utils/transaction')
const axios = require('axios')
const Deposit = require('../models/Deposit')

const payWithFlutterwave = async (req, res) => {
    const tx_ref = transaction_ref()

    const req_data = { ...req.body, tx_ref }
    console.log(req_data);

    const deposit = new Deposit(req_data)

    //flutterwave transaction data
    const data = {
        "tx_ref": tx_ref,
        "amount": req.body.amount,
        "currency": "NGN",
        "redirect_url" : "",
        "payment_options": "card",
        "meta": {},
        "customer": {
            "email": req.body.email,
            "phoneNumber": req.body.phone,
            "name": req.body.name
        },
        "customizations": {
            "title": "Tripescape Tour Payments",
            "description":"We are glad to help you reach your destination.",
            "logo": ""
        }
    }

    const options = {
        'method': 'POST',
        'url': 'https://api.flutterwave.com/v3/payments',
        'headers': {
            'Authorization': 'FLWSECK_TEST-992b206b85f7a22ba1a20da38daf33b6-X',
            'Content-Type': 'application/json'
        },
        data: data,
    }

    const paymentResult = await axios(options)

    if (paymentResult.status === 200) {
        deposit.save()
        .then((deposit_result) => {
            if (deposit_result) res.send(paymentResult.data)
        })
        .catch((err) => {
            console.log(err);
            res.send({ message: 'internal Server Error' });
        });   
    }

}

module.exports = {
    payWithFlutterwave
}