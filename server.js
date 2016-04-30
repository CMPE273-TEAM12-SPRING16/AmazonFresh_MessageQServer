var amqp = require('amqp')
    , util = require('util')

var logInSignup = require('./services/logInSignup');
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
    console.log("listening on login__signup_queue");

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
});
