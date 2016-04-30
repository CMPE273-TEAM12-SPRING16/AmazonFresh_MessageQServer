/**
 * Created by aneri on 29-04-2016.
 */

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
const crypto = require('crypto');
var res = {};
exports.getCustomerAccountDetails=function(msg, callback) {

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
    mongo.findOne("CUSTOMER_DETAILS", msg.userId, callbackFunction);
}

exports.fetchPurchaseHistory =function(msg, callback) {

    var queryJSON = {USER_ID: msg.userId};

    var projectionJSON = {PURCHASE_HISTORY: 1};
    mongo.findOneWithProjection("CUSTOMER_DETAILS", queryJSON, projectionJSON, function (err, result) {
        if (err) {
            console.log(err);
        } else {
console.log(result);
            var jsonResponse={"projection":result};
            callback(null, jsonResponse);


        }
    });
}