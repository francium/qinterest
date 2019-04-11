import os
from os import environ
import sys

from flask import (
    Flask,
    session,
    g,
    request,
    redirect,
    send_from_directory,
    render_template,
)

from . import db, github
from .models import User

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config['SECRET_KEY'] = environ.get('FLASK_SECRET_KEY')
    app.config['GITHUB_CLIENT_ID'] = environ.get('GITHUB_CLIENT_ID')
    app.config['GITHUB_CLIENT_SECRET'] = environ.get('GITHUB_CLIENT_SECRET')
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('SQLALCHEMY_DATABASE_URI')

    if test_config is not None:
        app.config.from_mapping(test_config)

    init_extensions(app)
    register_blueprints(app)
    register_cli(app)
    register_routes(app)

    return app


def register_cli(app: Flask):
    @app.cli.command()
    def init():
        db.create_all()


def register_blueprints(app: Flask):
    from .blueprint_default import blueprint as blueprint_default
    from .blueprint_api import blueprint as blueprint_api

    app.register_blueprint(blueprint_default, url_prefix='/')
    app.register_blueprint(blueprint_api, url_prefix='/api/')


def init_extensions(app: Flask):
    db.init_app(app)
    github.init_app(app)

    @app.before_request
    def before_request():
        g.user = None
        if 'username' in session:
            # NOTE: This might be expensive without proper caching layer. Perhaps it would
            # be better to do this on-demand rather than before each request (as of
            # writing this, only the '/' router makes use of the user object
            g.user = User.query.get(session['username'])

    @github.access_token_getter
    def token_getter():
        return g.github_access_token

    @app.route('/login')
    def route_login():
        if session.get('username', None) is None:
            return github.authorize()
        else:
            return redirect('/')

    @app.route('/logout')
    def route_logout():
        session.pop('username', None)
        return redirect('/')

    @app.route('/github-callback')
    @github.authorized_handler
    def authorized(oauth_token: str):
        next_url = request.args.get('next') or '/'
        if oauth_token is None:
            return redirect(next_url)

        g.github_access_token = oauth_token
        github_user = github.get('/user')
        g.github_access_token = None

        user = User.query.filter_by(name=github_user['login']).first()
        if user is None:
            user = User(
                name=github_user['login'],
                avatar=github_user['avatar_url'],
                github_access_token=oauth_token)
            db.session.add(user)

        user.github_access_token = oauth_token
        db.session.commit()

        g.user = user
        session['username'] = user.name
        return redirect(next_url)


def register_routes(app: Flask):
    @app.errorhandler(404)
    def route_404(e):
        initial_data = {'error': 404}
        return render_template('index.jinja', initial_data=initial_data)

    @app.errorhandler(500)
    def route_500(e):
        initial_data = {'error': 500}
        return render_template('index.jinja', initial_data=initial_data)

    @app.route('/favicon.ico')
    def route_favicon():
        return send_from_directory('static', 'favicon.ico')
