from kafka import KafkaConsumer
from kafka import KafkaProducer
import json

# Create a producer and send a message on a particular topic
def Produce(topic, msgToSend):
    producer = KafkaProducer(bootstrap_servers='kafka:9092')
    producer.send(topic, msgToSend)
    producer.flush()
    return

# Create a consumer and consume messages on a particular topic
def Consume(topic, fn: callable):
    consumer = KafkaConsumer(topic, bootstrap_servers='kafka:9092')
    for msg in consumer:
        fn(msg)

