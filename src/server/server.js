import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

import AWS from 'aws-sdk';

var dynamodb = new AWS.DynamoDB({
  endpoint: "http://localhost:4567",  // dynalite default
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: "local",
  httpOptions: {
    agent: new http.Agent()
  }
});

var app = express();
app.use(bodyParser.json());

app.get('/api/tables', function(req, res) {
  dynamodb.listTables({}, function(err, resp) {
    res.send(resp.TableNames);
  });
});

app.get('/api/describe/:tableName', function(req, res) {
  var params = {TableName: req.params.tableName}
  dynamodb.describeTable(params, function(err, resp) {
    res.send(resp);
  });
});

app.get('/api/scan/:tableName', function(req, res) {
  var params = {TableName: req.params.tableName};
  if (req.query.exclusiveStartKey != null) {
    // TODO: this is broken, gotta fix
    params['ExclusiveStartKey'] = parseInt(req.query.exclusiveStartKey);
  }
  
  dynamodb.scan(params, function(err, resp) {
    res.send(resp);
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
      console.error(err);
      res.status(err.statusCode)
      res.send({message: err.message});
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
