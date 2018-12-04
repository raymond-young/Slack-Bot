"use strict";

var _http = _interopRequireDefault(require("http"));

var _kafkaNode = _interopRequireDefault(require("kafka-node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setup a kafka consumer to listen to the 'message' topic, which recieves incoming messages to be sent to slack
var kafka_client = new _kafkaNode.default.Client('localhost:2181');
var consumer = new _kafkaNode.default.Consumer(kafka_client, [{
  topic: 'message',
  partition: 0
}]); // Converts a message into the format requested by slack (produces a string that may be placed into the body)

function form_response_body(message) {
  return {
    'text': message
  }.toString();
}

consumer.on('message', function (message) {
  try {
    var message_body = JSON.parse(message.value);
    var response_body = form_response_body(message_body.text); // TODO: body.status_code
    // Send the message to slack

    var req = _http.default.request(message_body.response_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(response_body)
      }
    }, function (res) {
      if (res.statusCode >= 400) console.log("Error from slack when sending message: " + res.statusCode);
    });

    req.write(response_body);
    req.end();
  } catch (e) {
    console.log("ERROR trying to send a message to slack: ");
    console.log(e);
  }
});