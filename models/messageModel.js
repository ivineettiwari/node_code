var apiRoutes = require('express').Router();
var Q = require('q');

function Callback(reqObj) {
    var deferred = Q.defer();
    let newMessage = {
        data: "Success"
    }
    deferred.resolve(newMessage)
    return deferred.promise;

}

module.exports = {
    Callback: Callback
}