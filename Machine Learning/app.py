from flask import Flask, request, redirect, url_for, flash, jsonify, make_response
import pickle as p
import json

app = Flask(__name__)


@app.route('/api/', methods=['POST'])
def makecalc():
    data = request.get_json()
    prediction = model.parse(data['input'])
    prediction = prediction['result']

    return make_response(jsonify({"prediction": prediction}))

if __name__ == '__main__':
    modelfile = 'gram_check.pickle'
    model = p.load(open(modelfile, 'rb'))
    app.run(debug=True)
