#!/usr/bin/env bash

# An intended starting point for the MLP-Learning-Project. This kills any existing containters, and build the docker containers according to the docker-compose.

docker-compose kill

docker container prune -f

docker-compose up --build --scale command=5