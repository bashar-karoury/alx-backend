#!/usr/bin/env python3
""" Basic Flask app with Babel installed"""
from flask import Flask, render_template, request, g
from flask_babel import Babel, _, format_datetime
import pytz
from datetime import datetime


class Config:
    """ config class to config babel"""
    # ...
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
# Create a single / route and an index.html template that simply outputs
# “Welcome to Holberton” as page title ( < title > )
# and “Hello world” as header ( < h1 > ).


def get_timezone():
    """ return locale language"""
    result = 'UTC'
    print(f'{__name__} get called')
    tz = request.args.get('timezone')
    if tz:
        result = tz
    if g.user:
        result = g.user.get("timezone")
    try:
        if pytz.timezone(result):
            return result
    except pytz.exceptions.UnknownTimeZoneError:
        print('Error time zone selection')
        return 'UTC'


def get_locale():
    """ return locale language"""

    locale = request.args.get('locale')
    if locale in Config.LANGUAGES:
        return locale
    if g.user:
        return g.user.get("locale")

    return request.accept_languages.best_match(Config.LANGUAGES)


# Pass the get_locale function to Babel
# babel.init_app(app, locale_selector_func=get_locale)
babel = Babel(app, locale_selector=get_locale, timezone_selector=get_timezone)

# Mocking users from a database
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user(id):
    """ returns user with given id"""
    if id:
        return users.get(int(id))

# A function that will run before every request


@app.before_request
def before_request_func():
    """ set global user for flask to use"""
    user_id = request.args.get('login_as')
    g.user = get_user(user_id)


@app.route('/')
def welcome():
    """ route function that renders 3-index.html """
    username = g.user.get('name') if g.user else None
    # Get the timezone from the selector
    timezone = pytz.timezone(get_timezone())
    print('timezone = ', timezone)
    print('type timezone = ', type(timezone))

    formatted_time = format_datetime(datetime.now(timezone))
    return (render_template('3-index.html', title=_("home_title"), header=_("home_header"), logged_in_as=_("logged_in_as"), not_logged_in=_("not_logged_in"), user_name=username, time=formatted_time))


if __name__ == '__main__':
    app.run(debug=True
            )
