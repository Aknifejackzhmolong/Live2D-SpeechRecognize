import requests
from flask import Flask, request
from aip import AipSpeech
from flask_cors import *
import json
""" Your Baidu APPID AK SK """
Baidu_APP_ID = ''
Baidu_API_KEY = ''
Baidu_SECRET_KEY = ''

client = AipSpeech(Baidu_APP_ID, Baidu_API_KEY, Baidu_SECRET_KEY)

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/speech", methods=["POST"])
def recognize():
    f = request.files["file"]
    res = client.asr(f.read(), 'wav', 16000, {'dev_pid': 1536})
    print(res)
    return json.dumps(res['result'])

""" Your Tuling APPID AK SK """
Tuling_API_KEY = ''
Tuling_USER_ID = ''

@app.route("/talk", methods=["GET"])
def conversation():
    requestData={
      "reqType":0,
      "perception": {
        "inputText": {
          "text": request.args.get("content")
        }
      },
      "userInfo": {
        "apiKey": Tuling_API_KEY,
        "userId": Tuling_USER_ID
      }
    }
    response=requests.post('http://openapi.tuling123.com/openapi/api/v2',data=json.dumps(requestData))
    return response.text

if __name__ == '__main__':
    app.run(
      port= 8001,
      debug=True
    )
