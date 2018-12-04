import express from 'express';
import body_parser from 'body-parser';
import kafka from 'kafka-node';

const kafka_client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});
const producer = new kafka.Producer(kafka_client);

function countdown(req, res) {
    // Content-Type must be x-www-form-urlencoded, as this is what slack specifies
    if(!req.is('application/x-www-form-urlencoded'))
        return res.sendStatus(400);
    
    // The fields text and response_url must be present
    if(!req.body.text || !req.body.response_url)
        return res.sendStatus(400);
    
    // Send message
    producer.send(
        // Message to send: Message body contains text and response token
        [{
            topic: 'countdown',
            messages: JSON.stringify({ 'text': req.body.text, 'response_token': req.body.response_url })
        }],
        // Producer callback
        (error, _data) => {
            // Our HTTP response will be based on whether we could send the message through kafka:
            if(!error)
                res.sendStatus(200);
            else {
                console.log("Producer error: " + error);
                res.sendStatus(504);
            }
        }
    );
}

// Connect to kafka
producer.on('ready', () => {
    console.log("Kafka connection made, starting server");
    // Slack only uses x-www-form-urlencoded
    const app = express();
    app.use(body_parser.urlencoded({ extended: true }));
    app.post('/countdown', countdown);
    app.listen(8081, () => console.log("API server listening on 8081"));
});
