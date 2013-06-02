#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import datetime
import json
from flask import Flask, render_template, Response, request
from pyjade.ext.jinja import PyJadeExtension
from model import db, Tweet, model_serializer
from helper import get_request_extension


class MyFlask(Flask):
    jinja_options = Flask.jinja_options
    jinja_options['extensions'].append(PyJadeExtension)

# setup application
app = MyFlask(__name__, static_folder='assets')


@app.route('/index.json', methods=["GET"])
@app.route('/', methods=["GET"])
@get_request_extension
def index(*args, **kwargs):
    if request.headers['Content-Type'] == 'application/json' or request.filetype == 'json':
        with db:
            if Tweet.objects.count() > 0:
                tweets = Tweet.objects.order_by('-created_at')
                serialized = [model_serializer(tweet) for tweet in tweets]
                datas = json.dumps(serialized)
            else:
                datas = json.dumps({"data": "null"})
        return Response(datas, mimetype="application/json", status=200)
    else:
        return render_template('index.jade')


@app.route('/<string:id>.json', methods=["GET"])
@app.route('/<string:id>', methods=["GET"])
@get_request_extension
def show(id, *args, **kwargs):
    if request.headers['Content-Type'] == 'application/json' or request.filetype == 'json':
        with db:
            tweet = Tweet.objects(id=id).first()
        data = json.dumps(model_serializer(tweet))
        return Response(data, mimetype="application/json", status=200)
    return render_template('index.jade')


@app.route('/', methods=["POST"])
def create():
    data = request.form
    with db:
        tweet = Tweet(text=data["text"])
        try:
            tweet.save()
        except Exception, e:
            print e
    serialized = model_serializer(tweet)
    resData = json.dumps(serialized)
    return Response(resData, mimetype="application/json", status=200)


@app.route('/<string:id>', methods=["PUT"])
def update(id):
    data = request.form
    with db:
        tweet = Tweet.objects(id=id).first()
        tweet.text = data['text']
        tweet.updated_at = datetime.now()
        try:
            tweet.save()
        except Exception, e:
            print e
    serialized = model_serializer(tweet)
    resData = json.dumps(serialized)
    return Response(resData, mimetype="application/json", status=200)


@app.route('/<string:id>', methods=["DELETE"])
def destroy(id):
    with db:
        try:
            Tweet.objects(id=id).first().delete()
            datas = json.dumps({'id': id})
        except:
            # raise
            raise
    return Response(datas, mimetype="application/json", status=200)


if __name__ == '__main__':
    app.run(debug=True)
