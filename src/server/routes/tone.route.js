const express = require('express');
const app = express();
const toneRoutes = express.Router();
const cors = require('cors');

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  authenticator: new IamAuthenticator({ apikey: 'N0BnOIYWXCogNU_YT40O4U3Io4OY2U4hnlK7va7RMS5O' }),
  version: '2017-09-21',
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api/'
});

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

toneRoutes.route('/tone').post(function(req, res) {
    console.log('original text: ' + req.body.text);
    toneAnalyzer.tone({
      toneInput: req.body.text,
      contentType: 'text/plain'
    })
    .then(response => {
      res.json(response.result.document_tone);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = toneRoutes;
