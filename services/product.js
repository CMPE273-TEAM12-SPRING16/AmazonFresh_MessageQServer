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

        }
    }
    mongo.removeOne('PRODUCTS', deleteProductJSON, callbackFunction);
}




exports.doSearch=function(msg, callback) {

    mongo.searchIt('PRODUCTS', msg.searchString, msg.searchType, function (err, searchRes) {

        if (err) {
            throw err;
        }
        else {
            if (searchRes) {
                console.log("product.js : doSearch() --> " + searchRes);
                var jsonResponse = {
                    "searchResults": searchRes,
                    "statusCode": 200
                };
                callback(null,jsonResponse)
            }
            else {
                jsonResponse = {result: "Nothing Found", "status": "OK"};
                callback(null,jsonResponse)
            }
        }
    });
}


function getDateAndMonth(results){
    console.log("getDateAndMonth");
    var monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var reviewArr = results.REVIEW_DETAILS;
    for(var rev in results.REVIEW_DETAILS){
        var date = results.REVIEW_DETAILS[rev].TIMESTAMP;
        var d = new Date(date);
        var month = monthName[d.getMonth()];
        var day = d.getDate();
        var year = d.getFullYear();
        var reviewDate = month+" "+day+", "+year;
        results.REVIEW_DETAILS[rev].REVIEWDATE = reviewDate;

    }
    return results;
}

exports.getProductDetails=function(msg, callback) {

    var productId= msg.product_id;
    var callbackFunction = function (err, results) {
        console.log(results);
        if (results) {
            var reviews = getDateAndMonth(results);

            var jsonResponse=({"productDetails": results});
           callback(null,jsonResponse);
        }

        else {
            var jsonResponse=({"statusCode": 401});
            callback(null,jsonResponse);
        }


    }

    mongo.findOneUsingId("PRODUCTS", productId, callbackFunction);
}


exports.doFetch10Products=function(msg, callback) {

    getProductJSON = {IS_APPROVED: 1};
    var callbackFunction = function (err, results) {
        if (err) {
            throw err;
           var json_responses = {"statusCode": 401};
            console.log("Error in doShowProductList");
            callback(null,json_responses);
        }
        else {
            var json_responses = {"statusCode": 200, "results": results};
            callback(null,json_responses);
        }
    }

    mongo.find('PRODUCTS', getProductJSON, callbackFunction);
}
