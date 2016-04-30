/**
 * Created by aneri on 29-04-2016.
 */

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
const crypto = require('crypto');
var res = {};
exports.handle_request=function(msg, callback) {

    var callbackFunction = function (err, result) {

        if (err) {
            console.log(err);
        }
        else {
console.log(result);
            res.customerDetails=result;
            callback(null, res);
        }
    }
    mongo.findOne("CUSTOMER_DETAILS", msg.userId, callbackFunction);
}