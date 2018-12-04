import queues
import json

def decode(msg):
    print(msg.value)
    message = json.loads(msg.value.decode())
    responseToken = message["response_token"]

# TODO: Perform checks to make sure that only valid eval() calls are performed.
    try:
        statement = eval(message)
        returnString(statement, responseToken, "ok")
    except: 
        returnString("Error processing your request.", responseToken, "error")


def returnString(statement, responseToken, statusCode):
    formatDict = {
        "message": statement,
        "status_code":statusCode,
        "response_token":responseToken
    }
    message = json.dumps(formatDict).encode()
    queues.Produce("message", message)

queues.Consume("calculator", decode)