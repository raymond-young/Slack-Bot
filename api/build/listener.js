"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _kafkaNode = _interopRequireDefault(require("kafka-node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
var kafka_client = new _kafkaNode.default.Client('localhost:2181');
var producer = new _kafkaNode.default.Producer(kafka_client);

function countdown(req, res) {
  // Content-Type must be x-www-form-urlencoded, as this is what slack specifies
  if (!req.is('application/x-www-form-urlencoded')) return res.sendStatus(400); // The fields text and response_url must be present

  if (!req.body.text || !req.body.response_url) return res.sendStatus(400); // Send message

  producer.send( // Message to send: Message body contains text and response token
  [{
    topic: 'countdown',
    messages: {
      'text': req.body.text,
      'response_token': req.body.response_url
    }.toString()
  }], // Producer callback
  function (error, _data) {
    // Our HTTP response will be based on whether we could send the message through kafka:
    if (!error) res.sendStatus(200);else res.sendStatus(504);
  });
} // Slack only uses x-www-form-urlencoded


app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.post('/countdown', countdown);
app.listen(8081, function () {
  return console.log("API server listening on 8081");
});