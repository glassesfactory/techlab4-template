#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from functools import wraps
from flask import request


def get_request_extension(f):
    @wraps(f)
    def decorated_func(*args, **kwargs):
        url = request.path
        root, ext = os.path.splitext(url)
        if ext == '.json':
            request.filetype = 'json'
        elif ext == '.xml':
            request.filetype = 'xml'
        elif ext == '.msg':
            request.filetype = 'msgpack'
        else:
            request.filetype = 'html'
        return f(*args, **kwargs)
    return decorated_func
