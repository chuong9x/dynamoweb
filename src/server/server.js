import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

import AWS from 'aws-sdk';

// Default to dynalite
var DYNALITE_URL = "http://localhost:4567";

var ENDPOINT = process.env.DYNAMODB_URL || DYNALITE_URL;
var REGION = process.env.DYNAMODB_REGION || "local";

var dynamodb = new AWS.DynamoDB({
  endpoint: ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: REGION,
  httpOptions: {
    agent: new http.Agent()
  }
});

var app = express();
app.use(bodyParser.json());


app.get('/api/metadata', function(req, res) {
  res.send({
    'endpoint': ENDPOINT,
    'region': REGION
  });
});


app.get('/api/tables', function(req, res) {
  dynamodb.listTables({}, function(err, resp) {
    if (err) {
      console.error(err);
      res.status(500);
    } else {
      res.send(resp.TableNames);
    }
  });
});

app.get('/api/describe/:tableName', function(req, res) {
  var params = {TableName: req.params.tableName}
  dynamodb.describeTable(params, function(err, resp) {
    if (err) {
      console.error(err);
      res.status(500);
    } else {
      res.send(resp);
    }
  });
});

app.get('/api/scan/:tableName', function(req, res) {
  var params = {TableName: req.params.tableName};
  if (req.query.exclusiveStartKey != null) {
    // TODO: this is broken, gotta fix
    params['ExclusiveStartKey'] = parseInt(req.query.exclusiveStartKey);
  }

  dynamodb.scan(params, function(err, resp) {
    if (err) {
      console.error(err);
      res.status(500);
    } else {
      res.send(resp);
    }
  });
});

app.put('/api/:tableName', function(req, res) {
  var item = req.body;
  var params = {
    TableName: req.params.tableName,
    Item: item
  }
  dynamodb.putItem(params, function(err, resp) {
    if (err != null) {
      res.status(400);
      res.send(err);
    } else {
      res.send(resp);
    }
  });
});

app.delete('/api/:tableName', function(req, res) {
  var key = req.body;
  var params = {
    TableName: req.params.tableName,
    Key: key
  }
  dynamodb.deleteItem(params, function(err, resp) {
    if (err != null) {
      console.error(err);
      res.status(500);
    } else {
      res.send(resp);
    }
  });
});

if (process.env.ENV == "dev") {  // webpack
  let webpack = require('webpack')
  let webpackDevMiddleware = require('webpack-dev-middleware');
  let webpackHotMiddleware = require('webpack-hot-middleware');
  let webpackDevConfig = require('../../webpack.dev.config');
  let compiler = webpack(webpackDevConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    stats: {colors: true}
  }));
  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }));
}

app.use(express.static(__dirname + '/../client/public'));  // TODO: implement this

app.get('/', function(req, res) {
  res.sendFile( 'client/index.html', {root: __dirname +'/../'});
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});
