/**
 * Created by aneri on 29-04-2016.
 */
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";



exports.doSearchAdmin = function(msg, callback)
{
  var searchString = msg.searchString;
  var searchType = msg.searchType;
	var collectionName = msg.collectionName;	

  console.log("search"+searchString);
  console.log("type"+searchType);
  console.log("name"+collectionName);

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