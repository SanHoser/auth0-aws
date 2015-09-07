var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();
var jwt = require('jsonwebtoken');
var env = require('auth0-variables');

var secret = env.AUTH0_SECRET;
    
exports.handler = function(event, context) {
    console.log('event:', event);
    console.log('context:', context);
    var petId = event.petId;
    var userEmail = '';
    var pets = {};

    // callback for reading pet info from dynamodb
    var readcb = function(err, data) {
        if(err) {
            console.log('error on GetPetsInfo: ',err);
            context.done('failed to retrieve pet information', null);
        } else {
            // make sure we have pets
            if(data.Item && data.Item.pets) {
                pets = data.Item.pets;
                var found = false;
                
                for(var i = 0; i < pets.length && !found; i++) {
                    if(pets[i].id === petId) {
                        if(!pets[i].isSold) {
                            pets[i].isSold = true;
                            pets[i].soldTo = userEmail;
                            var item = { username:"default",pets: pets};
                            dynamo.putItem({TableName:"Pets", Item:item}, writecb);
                            found = true;
                        }
                    }
                }
                if(!found) {
                    console.log('pet not found or is sold');
                    context.done('That pet is not available.', null);
                }
            } else {
               console.log('pet already sold');
               context.done('That pet is not available.', null);           
            }
        }
    };

    // callback for writing pet info back to dynamddb.
    var writecb = function(err, data) {
        if(!err) {
            context.done(null, pets);
        } else {
            console.log('error on GetPetsInfo: ',err);
            context.done('failed on update', null);
        }
    };

   // purchase execution logic.
    if(event.authToken) {
        jwt.verify(event.authToken, new Buffer(secret, 'base64'), function(err, decoded) {
            if(err) {
                console.log('err, failed jwt verification: ', err, 'auth: ', event.authToken);
                context.done('authorization failure', null);
            } else if(!decoded.email)
            {
                console.log('err, email missing in jwt', 'jwt: ', decoded);
                context.done('authorization failure', null);
            } else {
                userEmail = decoded.email;
                console.log('start PetsPurchase, petId', petId, 'userEmail:', userEmail);
                dynamo.getItem({TableName:"Pets", Key:{username:"default"}}, readcb);
            }
        });
    } else {
        console.log('invalid authorization header', event.authToken);
        context.done('authorization failure', null);
    }
};