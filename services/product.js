/**
 * Created by aneri on 30-04-2016.
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
var res = {};

exports.doDeleteProduct=function(msg, callback) {
    var deleteProductJSON = {"_id": msg.product_id};
    var callbackFunction = function (err, results) {
        if (err) {
            throw err;
           var json_responses = {"statusCode": 401};
            console.log("Error in renderHomepage");
            callback(null,json_responses)
        }
        else {
           var json_responses = {"statusCode": 200, "results": results};
            console.log("result is:" + results);
            callback(null,json_responses)
        }
    }
    mongo.removeOne('PRODUCTS', deleteProductJSON, callbackFunction);
}