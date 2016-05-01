/**
 * Created by aneri on 29-04-2016.
 */

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
const crypto = require('crypto');
var res = {};
var mysql = require('./mysql');



exports.getCustomerAccountDetails=function(msg, callback) {
    var queryJSON = {"USER_ID": msg.userId};
    console.log(msg.userId);
        var callbackFunction = function (err, result) {

        if (err) {
            console.log(err);
        }
        else {
console.log(result);
            var jsonResponse={"customerDetails":result};
            //res.customerDetails=result;
            callback(null, jsonResponse);
        }
    }
    mongo.findOne("CUSTOMER_DETAILS", queryJSON, callbackFunction);
}


exports.fetchPurchaseHistory =function(msg, callback) {

    var queryJSON = {"USER_ID": msg.userId};

    var projectionJSON = {PURCHASE_HISTORY: 1};
    mongo.findOneWithProjection("CUSTOMER_DETAILS", queryJSON, projectionJSON, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            var jsonResponse = {"projection": result};
            callback(null, jsonResponse);


        }
    });


}


exports.doUpdateUserDetails=function(msg, callback) {




            console.log("values updated");

            var userDetails = {
                "USER_ID": msg.userId,
                "FIRST_NAME": msg.firstName,
                "LAST_NAME": msg.lastName,
                "SSN": msg.ssn,
                "ADDRESS": msg.address,
                "CITY": msg.city,
                "STATE": msg.state,
                "ZIP": msg.zip,
                "PHONE_NUMBER": msg.phone,
                "USER_TYPE": msg.userType,
                "IS_APPROVED": 1
            };
            var whereJson = {"USER_ID": msg.userId};

            var userDetailsCallbackFunction = function (err, results) {
                var json_responses;

                if (err) {
                    console.log(err);
                }
                else {

                    if (msg.userType == 1) {


                        var customerCreditCardDetails = {
                            "USER_ID": msg.userId,
                            CREDIT_CARD_DETAILS: {
                                "CREDIT_CARD_NUMBER": msg.creditCardNumber,
                                "CREDIT_CARD_NAME": msg.creditCardName,
                                "EXPIRY_MONTH": msg.expiryMonth,
                                "EXPIRY_YEAR": msg.expiryYear,
                                "CVV": msg.cvv
                            }
                        };

                        var customerCreditCardDetailsCallbackFunction = function (err, results) {
                            var json_responses;

                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("creditCardDetailsInserted");
                            }
                        }
                        mongo.updateOne("CUSTOMER_DETAILS", whereJson, customerCreditCardDetails, customerCreditCardDetailsCallbackFunction);
                    }

                    json_responses = {"statusCode": 200};

                    callback(null, json_responses);
                    //checking for credit card details and entering the details in CREDITCARDTABLE

                }

            }

            mongo.updateOne("USER_DETAILS", whereJson, userDetails, userDetailsCallbackFunction);








}