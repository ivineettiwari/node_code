var apiRoutes = require('express').Router();
apiRoutes.post('/Callback', function (req, res) {
    console.log("inside whatsappcallback Manager");

    // console.log('Inside API Call');
    //API for 2 way communication. 
    var callbackModel = require('../models/messageModel.js');
    callbackModel.Callback(req.body)
        .then(function (result) {
            console.log(result)
            //res.writeHead(200, { 'Content-Type': 'text/xml' });
            // res.end(result.toString());
            res.json({
                code: "200",
                message: result.data
            });
        }).catch(
            function (err) {
                res.json({
                    code: "404",
                    message: err.sqlState == '22000' ? err.message : null
                });
            }
        );

});

module.exports = apiRoutes;