import queues
import json
import time

# Called when a message is consumed on the 'countdown' queue.
def decode(msg):

    # Load the 'value' from the json message, then extract the response URL
    print(msg.value)
    message = json.loads(msg.value.decode())
    responseToken = message["response_token"]
    
    try:
        # Interpret the inputs
        input = message["text"].split(" ")
        totalTime = interpret(input[0][:-1], input[0][-1:])
        interval = interpret(input[1][:-1], input[1][-1:])

        # Reply with the output, or an error string if the input parameters are incorrect
        while totalTime > 0:
            evaluateString(responseToken ,totalTime, interval)
            totalTime -= interval
            if totalTime <= 0:
                time.sleep(interval + totalTime)
                returnString("Done!", responseToken, "ok")
            else:
                time.sleep(interval)
    except:
        returnString("An error occured processing your request. Ensure to follow the format /countdown <time> <interval> (e.g. /countdown 5s 1s", responseToken, "error")
    
# Used to interpret the input parameters from the Kafka message. Converts the time into seconds.
def interpret(time, measurement):
    if measurement == 'm' or measurement == 'M':
        totalTime = int(time) * 60
    elif measurement =='h' or measurement == 'H':
        totalTime = int(time) * 60 * 60
    else:
        totalTime = time
    return int(totalTime)

# Determine the output message
def evaluateString(token, time = 0, interval = 0,):
    hours = int(time / 3600)
    minutes = int(time / 60 % 60)
    seconds = int(time%60)
    
    if time == 0 and interval == 0:
        statement = "Done!"
    else:
        if hours == 0 and minutes == 0:
            statement = str(seconds) + " seconds remaining"
        else:
            statement = ("%02d:" % hours if hours > 0 else "") + ("%02d:" % minutes if minutes > 0 else "00:") + "%02d remaining" % seconds
    returnString(statement, token, "ok")
    
    
# Reply on the 'message' topic queue.
def returnString(statement, responseToken, statusCode):
    formattedDict = {
        "message":statement,
        "status_code":statusCode,
        "response_token":responseToken
    }
    message = json.dumps(formattedDict).encode()
    queues.Produce("message", message)

# Consume a message from the 'countdown' topic
queues.Consume("countdown", decode)
