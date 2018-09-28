var express = require('express');
var router = express.Router();

//model
var SendUs = require('../models/sendus')
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

//get form send us details
router.post('/forms',(req,res)=>{
	var type = req.body.type;
	var goods = req.body.goods;
	var from = req.body.wherefrom;
	var to = req.body.whereto;
	var paymethod = req.body.paymethod;
	var amount = req.body.amount;
	
	// Sendus Object Info
	var formdata = {
		type: type,
		goods: goods,
		wherefrom: from,
		whereto: to,
		paymethod: paymethod,
		amount: amount
	}

	// as html
	var formdatahtml = `<h1>You have New Send Us Request</h1>
						<p>Type: ${type}</p>
						<p>Goods: ${goods}</p>
						<p>WhereFrom: ${from}</p>
						<p>WhereTo: ${to}</p>
						<p>paymethod: ${paymethod}</p>
						<p>Amount: ${amount}</p>`
	// Validation
	req.checkBody('type', 'Type is required').notEmpty();
	req.checkBody('goods', 'Commodity cannot be empty. Send us something').notEmpty();
	req.checkBody('wherefrom', 'wherefrom field cannot be empty').notEmpty();
	req.checkBody('whereto', 'whereto field cannot be empty').notEmpty();
	req.checkBody('paymethod', 'specify a pay method').notEmpty();
	

	var errors = req.validationErrors();
	if(errors){
		console.log('sendus form has errors (ie. has empty fields and cannot be submitted!')
		res.render('index', {errors: errors})
	}
	else {

	var newInfo = new SendUs({
		type: type,
		goods: goods,
		wherefrom: from,
		whereto: to,
		paymethod: paymethod,
		amount: amount,
	})
	SendUs.createInfo(newInfo, function (info, err) {
		if (err) throw err;
		console.log(info);
	});
	res.render('history',{ alert: ' Your details have been successfully submitted. We will give you a call now'})
	res.redirect('/users/login');


	// NodeMailer Setup:: To send the SendUs Form details  To Email:
	'use strict';
	var nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
			user: 'admin', // generated ethereal user
            pass: '1234' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'SendUs Form Details ✔', // Subject line
        text: formdata, // plain text body
        html: formdatahtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

}



})


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;