import pickle
from flask import make_response,jsonify
from flask.globals import request
from flask_restful import Resource


def load_ai_model():
    model=pickle.load(open('backend/resources/gram_check.pickle','rb'))
    return model


class GrammarCheck(Resource):
    def post(self):
        model=load_ai_model()
        data=request.get_json()
        prediction=model.parse(data['input'])
        prediction=prediction['result']
        return make_response(jsonify({"prediction": prediction}))

