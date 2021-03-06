var amqp = require('amqp')
    , util = require('util')

var logInSignup = require('./services/logInSignup');
var users = require('./services/users');
var admin = require('./services/admin');
var farmer = require('./services/farmer');
var product=require('./services/product');
//Gaurav add your file variable here
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
    console.log("listening on login__signup_queue");
    // Gaurav  enter heree
    cnn.queue('loginSignupQueue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            if (message.functionToBeImplemented == "signup")
            {
                logInSignup.handle_request(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
        });
    });


    console.log("listening on farmer_queue");
    cnn.queue('farmer_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            console.log(message.functionName);
              if(message.functionName == "doShowProductList")
            {
                farmer.doShowProductList(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }else
                if(message.functionName == "doShowFarmerProfile")
                 {
                    farmer.doShowFarmerProfile(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }else
                if(message.functionName == "doUpdateProfile")
                 {
                    farmer.doUpdateProfile(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                        });

                    });
                }
            else
                if(message.functionName == "doAddIntroduction")
                 {
                    farmer.doAddIntroduction(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                        });

                    });
                }
            else
                if(message.functionName == "doDeleteProfile")
                 {
                    farmer.doDeleteProfile(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                        });

                    });
                }
            else
                if(message.functionName == "addFarmerReview")
                 {
                    farmer.addFarmerReview(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                        });

                    });
                }
            else
                if(message.functionName == "getFarmerDetails")
                 {
                    farmer.getFarmerDetails(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                        });

                    });
                }    
            
        });
    });

    console.log("listening on AdminQueue");
    cnn.queue('AdminQueue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            // Chirag
            if(message.functionName == "doSearchAdmin")
            {
                admin.doSearchAdmin(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doShowPendingCustAprroval")
            {
                admin.doShowPendingCustAprroval(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doApproveCustomer")
            {
                admin.doApproveCustomer(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doRejectCustomer")
            {
                admin.doRejectCustomer(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doShowPendingFarmerAprroval")
            {
                admin.doShowPendingFarmerAprroval(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doApproveFarmer")
            {
                admin.doApproveFarmer(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doRejectFarmer")
            {
                admin.doRejectFarmer(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doShowPendingProductAprroval")
            {
                admin.doShowPendingProductAprroval(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doApproveProduct")
            {
                admin.doApproveProduct(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doRejectProduct")
            {
                admin.doRejectProduct(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "doShowAllCustomer")
            {
                admin.doShowAllCustomer(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "reviewFarmer")
            {
                admin.reviewFarmer(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "reviewProduct")
            {
                admin.reviewProduct(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

            else if(message.functionName == "fetchAllBills") {
                admin.fetchAllBills(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            else if(message.functionName == "showDeliveriesStat")
            {
                admin.showDeliveriesStat(message, function (err, res) {

                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

        });
    });

    cnn.queue('usersQueue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            if (message.functionToBeImplemented == "getCustomerAccountDetails")
            {
                users.getCustomerAccountDetails(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

           else if (message.functionToBeImplemented == "doUpdateUserDetails")
            {
                users.doUpdateUserDetails(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }
            // Aneri

            else if (message.functionToBeImplemented == "fetchPurchaseHistory")
            {
                users.fetchPurchaseHistory (message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

        });
    });

    cnn.queue('productsQueue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            if (message.functionToBeImplemented == "doDeleteProduct")
            {
                product.doDeleteProduct(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

           else if (message.functionToBeImplemented == "doSearch")
            {
                console.log("inside server");
                product.doSearch(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

            else if (message.functionToBeImplemented == "getProductDetails")
            {
                console.log("inside server");
                product.getProductDetails(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

            else if (message.functionToBeImplemented == "doFetch10Products")
            {
                console.log("inside server");
                product.doFetch10Products(message, function (err, res) {

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            }

        });
    });





});