/**
 * Created by aneri on 29-04-2016.
 */
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
var user_id_arr = [];


exports.doSearchAdmin = function(msg, callback)
{
  var searchString = msg.searchString;
  var searchType = msg.searchType;
	var collectionName = msg.collectionName;	

  mongo.searchItAdmin(collectionName, searchString, searchType, function(err,searchRes){

    if(err){
      throw err;
    }
    else
    {
      if(searchRes){
        var jsonResponse = {
          "searchResults" : searchRes,
          "statusCode" : 200
        };
        callback(null, jsonResponse);
      }
      else {
        jsonResponse = {result : "Nothing Found", "status" : "OK"};
        callback(null, jsonResponse);
      }
    }
  });
}

exports.doShowPendingCustAprroval = function(msg, callback) {
  
  var userId = msg.userId;
  var getCustomerPendingJSON = msg.getCustomerPendingJSON;

  var callbackFunction = function (err, results) {
           if(err)
    {
      throw err;
      json_responses = {"statusCode" : 401};
      console.log("Error in doShowProductList");
      callback(null, json_responses);
    }
    else
    {
      Object.keys(results).forEach(function(index) {
        // here, we'll first bit a list of all LogIds

        var id = results[index].USER_ID;
        user_id_arr.push(id);
      });
      console.log(user_id_arr);
      var cardDetailJSON = {"USER_ID" : {$in : user_id_arr}};
      console.log(user_id_arr);
      mongo.find('CUSTOMER_DETAILS',cardDetailJSON,function(err,userDetails){
           if(err)
          {
            throw err;
            json_responses = {"statusCode" : 401};
            console.log("Error in doShowProductList");
            //res.send(json_responses);
            callback(null, json_responses);
          }
          else{



            Object.keys(results).forEach(function(user) {
              Object.keys(userDetails).forEach(function(card) {
                if(userDetails[card].USER_ID == results[user].USER_ID){
                  console.log(userDetails[card].CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER);
                  results[user].CARD_NUMBER = userDetails[card].CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER;

                }
                  });
                });

            results.CARD_NUMBER = userDetails;
            json_responses = {"statusCode" : 200,"results":results};
            //res.send(json_responses);
            callback(null, json_responses);
          }
        });

    }
}
    mongo.find('USER_DETAILS',getCustomerPendingJSON,callbackFunction);
};

exports.doApproveCustomer = function(msg, callback) {
  var customerId = msg.customerId;
  console.log("customer is id"+customerId);

  var callbackFunction = function (err, results) {
           if(err)
    {
      throw err;
      var json_responses = {"statusCode" : 401};
      console.log("Error in doShowProductList");
      callback(null, json_responses);
    }
    else {
         var approveUser = "UPDATE USERS set IS_APPROVED= 1 where USER_ID='" + customerId + "'";

         mysql.fetchData(function (err, results) {

           if (results.affectedRows > 0) {

         console.log(results.IS_APPROVED);

         console.log("Approve Requests ");
         console.log(results);
         var json_responses = {"statusCode": 200, "results": results};
         callback(null, json_responses);
       }
         },approveUser);
    }
    }
    console.log("doApproveCustomer "+customerId);

    var approvalWhereJSON = {"USER_ID" : customerId};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 1}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
}

exports.doRejectCustomer = function(msg, callback){
  var customerId = msg.customerId;


  var callbackFunction = function (err, results) {
   if(err)
    {
      throw err;
      json_responses = {"statusCode" : 401};
      console.log("Error in doShowProductList");
      res.send(json_responses);
    }
    else
    {
      var rejectUser = "update USERS set IS_APPROVED= 2 where USER_ID='" + customerId + "'";

      mysql.fetchData(function (err, results) {

        if (results.affectedRows > 0) {

          console.log(results.IS_APPROVED);
      console.log("Pending customer requests ");
      console.log(results);
      json_responses = {"statusCode" : 200,"results":results};
      callback(null, json_responses);
        }
      },rejectUser);
    }
    }

    var approvalWhereJSON = {"USER_ID" : customerId};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 2}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
}

exports.doShowPendingFarmerAprroval = function(msg, callback){
  var userId = msg.userId;
  var getCustomerPendingJSON = msg.getCustomerPendingJSON;

  var callbackFunction = function (err, results) {
     if(err)
      {
        throw err;
        json_responses = {"statusCode" : 401};
        console.log("Error in doShowProductList");
        callback(null, json_responses);
      }
      else
      {
        json_responses = {"statusCode" : 200,"results":results};
        callback(null, json_responses);
      }
    }

    mongo.find('USER_DETAILS',getCustomerPendingJSON,callbackFunction);
 }

 exports.doApproveFarmer = function(msg, callback){
  var customerId = msg.customerId;


  var callbackFunction = function (err, results) {
    if(err)
      {
        throw err;
        json_responses = {"statusCode" : 401};
        console.log("Error in doShowProductList");
        callback(null, json_responses);
      }
      else
      {
        var approveFarmer = "UPDATE USERS set IS_APPROVED= 1 where USER_ID='" + customerId + "'";

        mysql.fetchData(function (err, results) {

          if (results.affectedRows > 0) {
            console.log("Pending customer requests ");
            json_responses = {"statusCode" : 200,"results":results};
            callback(null, json_responses);
            }
          },approveFarmer);
        }
    }

    var approvalWhereJSON = {"USER_ID" : customerId};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 1}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 exports.doRejectFarmer = function(msg, callback){
  var customerId = msg.customerId;


  var callbackFunction = function (err, results) {
           if(err)
    {
      throw err;
      json_responses = {"statusCode" : 401};
      console.log("Error in doShowProductList");
      callback(null, json_responses);
    }
    else
    {
      var rejectFarmer = "update USERS set IS_APPROVED=2  where USER_ID=" + customerId + ";";

      mysql.fetchData(function (err, results) {

      if (results.affectedRows > 0) {
          console.log("Pending customer requests ");
          console.log(results);
          json_responses = {"statusCode" : 200,"results":results};
          callback(null, json_responses);
        }
      },rejectFarmer);
    }
    }

    var approvalWhereJSON = {"USER_ID" : customerId};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 2}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 exports.doShowPendingProductAprroval = function(msg, callback) {
  var userId = msg.userId;
  var getProductPendingJSON = msg.getProductPendingJSON;
  
  var callbackFunction = function (err, results) {
  if(err)
    {
      throw err;
      json_responses = {"statusCode" : 401};
      console.log("Error in doShowPendingProductAprroval");
      callback(null, json_responses);
    }
    else
    {
      console.log(results);
      json_responses = {"statusCode" : 200,"results":results};
      callback(null, json_responses);
    }
    }

    mongo.find('PRODUCTS',getProductPendingJSON,callbackFunction);
 };

 exports.doApproveProduct = function(msg, callback) {

  var productId = new require('mongodb').ObjectID(msg.productId);
  var callbackFunction = function (err, results) {
     if(err)
      {
        throw err;
        json_responses = {"statusCode" : 401};
        console.log("Error in doApproveProduct");
        //res.send(json_responses);
        callback(null, json_responses);
      }
      else
      {
        console.log("Pending customer requests ");
        json_responses = {"statusCode" : 200,"results":results};
        //res.send(json_responses);
        callback(null, json_responses);
      }
    }

    var approvalWhereJSON = {"_id" : productId};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 1}};

    mongo.updateOne('PRODUCTS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

exports.doRejectProduct = function(msg, callback){
 var productId = new require('mongodb').ObjectID(msg.productId);
 var callbackFunction = function (err, results) {
   if(err)
    {
      throw err;
      json_responses = {"statusCode" : 401};
      console.log("Error in doShowProductList");
      callback(null, json_responses);
    }
    else
    {
      console.log("Pending customer requests ");
      json_responses = {"statusCode" : 200,"results":results};
      callback(null, json_responses);
    }
    }

    var approvalWhereJSON = {"_id" : productId};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 2}};

    mongo.updateOne('PRODUCTS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

exports.doShowAllCustomer = function(msg, callback)
{
var getCustomerPendingJSON = {"USER_TYPE":1};

  var callbackFunction = function (err, results) {
           if(err)
    {
      throw err;
      json_responses = {"statusCode" : 401};
      console.log("Error in doShowProductList");
      //res.send(json_responses);
      callback(null, json_responses);
    }
    else
    {
      Object.keys(results).forEach(function(index) {
                // here, we'll first bit a list of all LogIds

                var id = results[index].USER_ID;
                user_id_arr.push(id);
              });

      var cardDetailJSON = {"USER_ID" : {$in : user_id_arr}};
      console.log(user_id_arr);
      mongo.find('CUSTOMER_DETAILS',cardDetailJSON,function(err,userDetails){
           if(err)
          {
            throw err;
            json_responses = {"statusCode" : 401};
            console.log("Error in doShowProductList");
            callback(null, json_responses);
          }
          else{



            Object.keys(results).forEach(function(user) {
              Object.keys(userDetails).forEach(function(card) {
                if(userDetails[card].USER_ID == results[user].USER_ID){

                  results[user].CARD_NUMBER = userDetails[card].CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER;

                }
                  });
                });

            results.CARD_NUMBER = userDetails;
            json_responses = {"statusCode" : 200,"results":results};
            callback(null, json_responses); 
          }
        });

    }
}
    mongo.find('USER_DETAILS',getCustomerPendingJSON,callbackFunction);

}