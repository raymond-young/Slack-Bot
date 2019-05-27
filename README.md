# Slack-Plugin
Slack plugin designed to take follow simple commands and output.

Navigating to the project directory and running `./start.sh` should run the `docker-compose` file, which should in turn download all the dependencies required.

The script should also start a Zookeeper and Kafka server in sequence.

# Testing
Currently runs on `localhost:8081` ok. 
There is a file which can be imported into Postman to allow for testing (make sure HTTP proxy is started before you send the message if you wish to test).


# Technologies
- `Ansible` for automatic deployment
- `Docker` (Docker-compose) for containerisation and deployment
- `Python 3` for logic
- `Kafka` & `Zookeeper` as a messaging service

Relies on webhooks for the messages to appear in Slack.

# TODO
- Deploy it externally (potentially need a server with a public IP to do so).
