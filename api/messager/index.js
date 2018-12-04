import http from 'http';
import kafka from 'kafka-node';

const kafka_client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});
const request = require('request');

// Converts a message into the format requested by slack (produces a string that may be placed into the body)
function form_response_body(message) {
    return JSON.stringify({'text': message});
}

function on_message(message) {
    try {
        const message_body = JSON.parse(message.value);

        const response_body = form_response_body(message_body.message);
        // TODO: body.status_code
        // Send the message to slack
        request.post({
            url: message_body.response_token,
            method: 'POST',
            headers: {'Content-Type': 'application/json','Content-Length': Buffer.byteLength(response_body)},
            body: response_body
        }, (req) => {
            if(req && req.statusCode >= 400)
                console.log("Error from slack when sending message: " + req);
        });
    } catch(e) {
        console.log("ERROR trying to send a message to slack: ");
        console.log(e);
    }
}

function setup_consumer() {
    // Wait until our message topic exists before generating a consumer for it
    kafka_client.topicExists(['message'], (error) => {
        // If there's an error, retry. TODO: Max retries
        if(error) {
            console.log("Failed to connect to message topic: " + error + ", Retrying in 1s");
            setTimeout(setup_consumer, 1000);
        }
        else {
            console.log("Listening to [message] topic for messages");
            const consumer = new kafka.Consumer(kafka_client, [{ topic: 'message', partition: 0 }]);
            consumer.on('message', on_message);
        }
    });
}

kafka_client.on('ready', () => {
    console.log("Successfully connected to kafka");
    setup_consumer();
});