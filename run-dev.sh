#!/bin/bash

trap cleanup EXIT

docker-compose -f dev_db/docker-compose.yml up -d

yarn tauri dev

cleanup() {
    docker-compose -f dev_db/docker-compose.yml down
}

