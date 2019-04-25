//nodemon src/app.js -e js,hbs
const path = require('path');
const express = require('express');
const hbs = require('hbs');


const paypal = require('./utils/paypal');

const app = express();
const port = process.env.PORT || 3000; //heroku


// Define path for express config
const publicDirectoryPath = path.join(__dirname,'../public/');
const viewsPath=path.join(__dirname, '../templates/views');
const partialsPath=path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine','hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


// Sets the public path so we can access route with a equal file name in public dir
app.use(express.static(publicDirectoryPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded()); //get post values
// Parse JSON bodies (as sent by API clients)
app.use(express.json()); //get post values




app.get('',(req, res)=>{
    res.render('index',{
        title:'EC-Rest',
        name:'EC-Rest',
    });
});

// app.post('/create-payment/:test',(req, res)=>{
app.post('/create-payment',(req, res)=>{
    // req.params.test;
    
    // res.send(req.params.test);
    // const tokenExists = paypal.checkToken();
    // if(tokenExists){
    //     const createPaymentRes = paypal.createPayment(tokenExists.access_token, (data)=> {
    //         res.send(data);    
    //     });
    // }else{
    //     let createPaymentRes = paypal.getToken((data)=>{
    //         console.log(data);
    //         res.send({
    //           access_token: data.access_token
    //         });
    //     })
    // }
    
    const access_token = 'A21AAFpKSmsuywbfNivt6tiEjYxxxPhf-zzihwlZ6zAOTP_sLh_zu-WxoLAwetGPp5iO5OZy4ocaaC48wSPrfgcRbpgzRRkgg';
    
    paypal.createPayment(access_token, (data)=>{
        res.send(data);
    });
    // http://stack.desenvolvedor.expert/roteamento-de-aplicacoes-node/organizando-rotas.html
    
});
// https://www.npmjs.com/package/node-fetch
// https://developer.paypal.com/docs/api/get-an-access-token-curl/







app.post('/execute-payment',(req, res)=>{
    // fs.writeFileSync('_execute_payment105.json', 'teste');

    const access_token = 'A21AAFpKSmsuywbfNivt6tiEjYxxxPhf-zzihwlZ6zAOTP_sLh_zu-WxoLAwetGPp5iO5OZy4ocaaC48wSPrfgcRbpgzRRkgg';
    const paymentID = req.body.paymentID;   
    const payerID = req.body.payerID;   
    // const paymentID = req.query.paymentID;   
    // const payerID = req.query.payerID;   

    paypal.executePayment(access_token,paymentID,payerID, (data) =>{
        res.send(data);
    });
    
});


app.get('*',(req, res)=>{ // must to be the last one, the wildcard (*) means for but the 'above gets'
    // res.send('Page not found...');
    res.render('404',{
        title: '404',
        name: 'Jeu Junior',
        errorMessage: 'Page not found...'
    });
});


app.listen(port,()=>{ // heroku or local
    console.log('Server is up on port ' + port);
});


