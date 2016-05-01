/**
 * Created by aneri on 29-04-2016.
 */
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
const crypto = require('crypto');
var res = {};

exports.handle_request=function(msg, callback)
{

    var emailExists = "select 'x' from users where email='" + msg.email + "'";
    mysql.fetchData(function (err, results) {

        if (results.length > 0) {
            console.log("email exists");
            res.code=401;
            callback(null, res);


        }
        else {

            const salt = crypto.randomBytes(16).toString('hex');
            const enPassword = crypto.pbkdf2Sync(msg.password, salt, 100000, 64, 'sha256').toString('hex');

            var insertSignUpDetails = "insert into users(EMAIL,PASSWORD,SALT,USERTYPE,IS_APPROVED) values ('" +
                msg.email + "','" +
                enPassword + "','" +
                salt + "','" +
                msg.userType + "', 0 )";
            mysql.fetchData(function (err, results) {

                if (results.affectedRows > 0) {


                    console.log(results);
                    console.log(results.insertId);
                    var userId = results.insertId;
                    //req.session.userType = userType;
                    //req.session.userId = userId;
                    console.log("sql values inserted");

                    //insert remaining values in mongo

                    var userDetails = {
                        "USER_ID":userId,
                        "FIRST_NAME": msg.firstName,
                        "LAST_NAME": msg.lastName,
                        "EMAIL_ID": msg.email,
                        "SSN": msg.ssn,
                        "ADDRESS": msg.address,
                        "CITY": msg.city,
                        "STATE": msg.state,
                        "ZIP": msg.zip,
                        "PHONE_NUMBER": msg.phone,
                        "USER_TYPE": msg.userType,
                        "IS_APPROVED":0

                    };

                    var userDetailsCallbackFunction = function (err, results) {
                        var json_responses;

                        if (err) {
                            console.log(err);
                        }
                        else {

                            if(msg.userType==1) {


                                var customerCreditCardDetails = {
                                    "USER_ID": userId,
                                    CREDIT_CARD_DETAILS:
                                    {
                                        "CREDIT_CARD_NUMBER": msg.creditCardNumber,
                                        "CREDIT_CARD_NAME": msg.creditCardName,
                                        "EXPIRY_MONTH": msg.expiryMonth,
                                        "EXPIRY_YEAR": msg.expiryYear,
                                        "CVV": msg.cvv}
                                };
                                var customerCreditCardDetailsCallbackFunction = function (err, results) {
                                    var json_responses;

                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log("creditCardDetailsInserted");
                                        res.code=200;
                                        callback(null, res);
                                    }
                                }
                                mongo.insertOne("CUSTOMER_DETAILS", customerCreditCardDetails, customerCreditCardDetailsCallbackFunction);
                            }
                            if(msg.userType==2) {


                                var farmerDetails = {
                                    "USER_ID": userId,
                                    "AVERAGE_RATING": 0,
                                    "REVIEW_DETAILS": [],
                                    "INTRODUCTION_DETAILS":""
                                }
                                var FarmerDetailsCallbackFunction = function (err, results) {
                                    var json_responses;

                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log("farmerInserted");
                                        res.code=200;
                                        callback(null, res);

                                    }
                                }
                                mongo.insertOne("FARMER_DETAILS",farmerDetails, FarmerDetailsCallbackFunction);
                            }



                            //checking for credit card details and entering the details in CREDITCARDTABLE

                        }

                    }

                    mongo.insertOne("USER_DETAILS", userDetails, userDetailsCallbackFunction);
                }



                else {
                    res.code=401;
                    console.log("data insertion failed");
                    callback(null, res);
                }
            }, insertSignUpDetails);
        }

    }, emailExists);


}
