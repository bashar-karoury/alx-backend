#!/usr/bin/env python3
""" Basic Flask app"""
from flask import Flask, render_template

app = Flask(__name__)

# Create a single / route and an index.html template that simply outputs
# “Welcome to Holberton” as page title ( < title > )
# and “Hello world” as header ( < h1 > ).


@app.route('/')
def welcome():
    """ route function that renders 0-index.html """
    return (render_template('0-index.html'))


if __name__ == '__main__':
    app.run()
