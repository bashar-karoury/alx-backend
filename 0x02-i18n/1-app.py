#!/usr/bin/env python3
""" Basic Flask app with Babel installed"""
from flask import Flask, render_template
from flask_babel import Babel


class Config:
    """ config class to config babel"""
    # ...
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)
# Create a single / route and an index.html template that simply outputs
# “Welcome to Holberton” as page title ( < title > )
# and “Hello world” as header ( < h1 > ).


@app.route('/')
def welcome():
    """ route function that renders 0-index.html """
    return (render_template('1-index.html'))


if __name__ == '__main__':
    app.run()
