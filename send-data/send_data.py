# import random
from lambdanow.data import DataClient
# import time
from datetime import datetime
from time import sleep

client = DataClient('https://api.realtimeheatmap.com/1', '7f4e804948')


def timestamp_millis():
    return int((datetime.now() - datetime(1970, 1, 1)).total_seconds() * 1000)

f = open('example-data2.txt', "r")
lines = f.readlines()
blob = {}
blob_list = []
count = 0
key = None
value = None
blob = {
    'view': 'nothing',
    'x': 0,
    'y': 0,
    'xMax': 0,
    'yMax': 0,
    'timestamp': timestamp_millis()
}

dothis = range(30)

print "Send data without any end"
while True:
    for line in lines:
        words = line.split("  ")
        key = words[0].split(":")[0]
        value = words[1].split("\n")[0]

        # print("key: ", key, " value: ", value)

        if key == 'view':
            blob['view'] = value
        elif key == 'x':
            blob['x'] = int(value)
        elif key == 'y':
            blob['y'] = int(value)
        elif key == 'xMax':
            blob['xMax'] = int(value)
        elif key == 'yMax':
            blob['yMax'] = int(value)

        count = count + 1

        if count % 5 == 0:
            print blob
            for thing in dothis:
                try:
                    blob['timestamp'] = timestamp_millis()
                    result = client.send('heatmapchannel1', blob)
                    print (thing, " ", blob)

                except RuntimeError as e:
                    print "An error occured: {}".format(e.message)
