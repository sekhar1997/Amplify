const AWS = require("aws-sdk");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var bodyParser = require("body-parser");
var express = require("express");

AWS.config.update({ region: "us-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "users-dev";

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "Email";
const partitionKeyType = "S";
const sortKeyName = "Name";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/users";
const UNAUTH = "UNAUTH";
const hashKeyPath = "/:" + partitionKeyName;
const sortKeyPath = hasSortKey ? "/:" + sortKeyName : "";
// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
};

// app.get(path, function (req, res) {
//   res.json("test data");
// });

app.get(path, function (req, res) {
  console.log(path);
  // res.json("helloo ");
  var condition = {};
  condition[partitionKeyName] = {
    ComparisonOperator: "CONTAINS",
  };

  // if (userIdPresent && req.apiGateway) {
  //   condition[partitionKeyName]["AttributeValueList"] = [
  //     req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH,
  //   ];
  // } else {
  //   try {
  //     condition[partitionKeyName]["AttributeValueList"] = [
  //       convertUrlType(req.params[partitionKeyName], partitionKeyType),
  //     ];
  //   } catch (err) {
  //     res.statusCode = 500;
  //     res.json({ error: "Wrong column type " + err });
  //   }
  // }

  let queryParams = {
    TableName: tableName,
    // KeyConditions: condition,
  };

  dynamodb.scan(queryParams, (err, data) => {
    console.log(queryParams);
    if (err) {
      res.statusCode = 500;
      res.json({ error: "Could not load items: " + err });
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path, function (req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
  };
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: "put call succeed!", url: req.url, data: data });
    }
  });
});

/************************************
 * HTTP post method for insert object *
 *************************************/

app.post(path, function (req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
  };
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: "post call succeed!", url: req.url, data: data });
    }
  });
});

/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(path, function (req, res) {
  console.log(req.body);
  let removeItemParams = {
    TableName: tableName,
    Key: {
      Email: req.body.Email,
      Name: req.body.Name,
    },
  };

  dynamodb.delete(removeItemParams, (err, data) => {
    console.log(removeItemParams);
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});
app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
