# Slack-Plugin
Slack plugin that was started whilst interning at Orion Health

`start.sh` should run the docker-compose, which should in turn download all the dependencies required.

# Testing
Currently runs on `localhost:8081` ok. 
There is a file which can be imported into Postman to allow for testing (make sure HTTP proxy is started before you send the message if you wish to test).


# Technologies
- `Ansible` for automatic deployment
- `Docker` (Docker-compose) for containerisation and deployment
- `Python 3` for logic
- `Kafka` & `Zookeeper` as a messaging service
