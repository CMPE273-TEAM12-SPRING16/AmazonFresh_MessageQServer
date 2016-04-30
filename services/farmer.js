/**
 * Created by aneri on 29-04-2016.
 */
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";



exports.doShowProductList = function(msg, callback)
{
  console.log("Product JSON ");
  
  var JSON = {"FARMER_ID" : msg.FARMER_ID,"IS_APPROVED": msg.IS_APPROVED};
  console.log(JSON);
  mongo.find('PRODUCTS',JSON,function(err,searchRes){

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

exports.doShowFarmerProfile = function(msg, callback)
{
  console.log("Product JSON ");
  
  var JSON = {"USER_ID" : msg.USER_ID};
  console.log(JSON);
  mongo.findOne('USER_DETAILS',JSON,function(err,searchRes){

    if(err){
      throw err;
    }
    else
    {
      console.log("Result received in doShowFarmerProfile");
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

exports.doUpdateProfile = function(msg, callback)
{
  console.log("Product JSON ");
  
  var updatedWhereJSON = msg.updatedWhereJSON;
  var updatedDetailJSON = msg.updatedDetailJSON
  
  mongo.updateOne('USERS',updatedWhereJSON,updatedDetailJSON,function(err,searchRes){

    if(err){
      throw err;
    }
    else
    {
      console.log("Result received in doUpdateProfile");
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

exports.doAddIntroduction = function(msg, callback)
{
  console.log("Product JSON ");
  
  var updatedWhereJSON = msg.WhereJSON;
  var updatedDetailJSON = msg.introductionSetJSON
  
  mongo.updateOne('FARMER_DETAILS',updatedWhereJSON,updatedDetailJSON,function(err,searchRes){

    if(err){
      throw err;
    }
    else
    {
      console.log("Result received in doUpdateProfile");
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

exports.doDeleteProfile = function(msg, callback)
{
  console.log("Product JSON ");
  
  var updatedWhereJSON = msg.deleteWhereJSON;
  var updatedDetailJSON = msg.deleteSetJSON
  
  mongo.updateOne('FARMER_DETAILS',updatedWhereJSON,updatedDetailJSON,function(err,searchRes){

    if(err){
      throw err;
    }
    else
    {
      if(searchRes){
          console.log("Result received in doDeleteProfile");
          var deleteQuery = "UPDATE USERS SET IS_APPROVED = " + 0 +" WHERE USER_ID = "+ updatedWhereJSON.USER_ID;
          mysql.updateData(deleteQuery,function (err, results) {
            if(err){
              throw err;
            }else{
                var jsonResponse = {
                "searchResults" : searchRes,
                "statusCode" : 200
                };
                callback(null, jsonResponse);
              }
          });
        }
      else {
      
          jsonResponse = {result : "Nothing Found", "status" : "OK"};
          callback(null, jsonResponse);
        }
      
    }   
  });
}

