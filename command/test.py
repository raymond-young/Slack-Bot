import queues
import json

test = { 
        "text":"1h 1s", 
        "response_token":"testing"
        }
testjson = json.dumps(test).encode()
queues.Produce("countdown", testjson)
