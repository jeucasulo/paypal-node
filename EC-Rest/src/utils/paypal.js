const request = require('request')
const fs = require('fs');

const checkToken = () => {
    // const path = "'/EC-Rest/_access_token.json'";
    const path = "./_access_token.json";
    if(fs.existsSync(path)){
        const dataBuffer = fs.readFileSync('_access_token.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    }else{
        return false;
    }
}
const getToken = (callback) => {
    const clientId = "AdYLZtwY8zHLgVLR7uawFMLHXWT-jswUL0jnyZJAIfjjYzsWfR9mxHhKQaAcDR409oZmujTDAh207JJI";
    const secret = "EA1M8eQy2L81475BiOGvH2ioxMe5A7fAGj5oC1ODG5--yd49c4mIab5dwZDoeIuYbvh7w3GznoHTqOjT";
    const credentialsTo64 = clientId+":"+secret;
    const buff = new Buffer(credentialsTo64);  
    const base64data = buff.toString('base64');

    
    const endpoint = 'https://api.sandbox.paypal.com/v1/oauth2/token';

    request({ url: endpoint, json: true, method:'post', headers: { 
        'Accept': 'application/json' ,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/x-www-form-urlencoded', //optional
        'Authorization':'Basic '+ base64data+''
        },
        form:{
            grant_type: 'client_credentials'
        }
     }, (error, response) => {
        if (error) {
            callback("error")
        } else if (response.body.error) {
            callback("response.body.error")
        } else {
            callback(response.body)
            //writes down the access_token json file
            const objToJson = JSON.stringify(response.body);
            fs.writeFileSync('_access_token.json', objToJson)
        }
    })

}

const createPayment = (access_token, callback) => {
    const endpoint = 'https://api.sandbox.paypal.com/v1/payments/payment';
   
    var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://return.url",
        "cancel_url": "http://cancel.url"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "BRL",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "BRL",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
    };


    request({ url: endpoint, json: true, method:'post', headers: { 
        'Content-Type': 'application/json', //optional
        'Authorization':'Bearer '+ access_token+''
        },
        body:create_payment_json
     }, (error, response) => {
        if (error) {
            const objToJson = JSON.stringify(error);
            fs.writeFileSync('_create_payment-error.json', objToJson);
            callback(error)
        } 
        else if (response.body.name) {
            const objToJson = JSON.stringify(response.body.name);
            fs.writeFileSync('_create_payment-else-if-error.json', objToJson);
            callback(response.body.message)//invalid resquest see details
        } 
        else {
            const objToJson = JSON.stringify(response);
            fs.writeFileSync('_create_payment.json', objToJson)
            callback(response)
        }
    })
}

const executePayment = (access_token, payId, payerId, callback) => {
    fs.writeFileSync('_payID.json', payId);
    fs.writeFileSync('_payerID.json', payerId);

    const endpoint = 'https://api.sandbox.paypal.com/v1/payments/payment/'+payId+'/execute';
   
    var execute_payment_json = {
        "payer_id": payerId
    };
    
    const postfields = '{"payer_id":"'+payerId+'"}';        

    request({ url: endpoint, json: true, method:'post', headers: { 
        'Content-Type': 'application/json', //optional
        'Authorization':'Bearer '+ access_token+''
        },
        body:execute_payment_json
        // body:'{"payer_id":'+payerId+'}'
     }, (error, response) => {
        if (error) {
            const objToJson = JSON.stringify(error);
            fs.writeFileSync('_execute_payment-error.json', objToJson);
            callback(error)
        } 
        else if (response.body.name) {
            const objToJson = JSON.stringify(response.body.name);
            fs.writeFileSync('_execute_payment-else-if-error.json', objToJson);
            callback(response.body)//invalid resquest see details
        } 
        else {
            const objToJson = JSON.stringify(response);
            fs.writeFileSync('_execute_payment.json', objToJson)
            callback(response)
        }
    })
}

// https://developer.paypal.com/docs/archive/checkout/how-to/server-integration/#2-set-up-your-server-to-call-the-paypal-api

module.exports = {
    createPayment:createPayment,
    executePayment:executePayment,
    checkToken:checkToken,
    getToken:getToken
}