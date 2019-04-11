from flask import (
    g,
    redirect,
    render_template,
    session,
)

from qinterest import github
from qinterest.consts import INITIAL_PIN_COUNT
from qinterest.queries import query_front_page_data, query_pins
from qinterest.models import Pin, User
from . import blueprint


@blueprint.route('/')
def route_index():
    initial_data = {
        'user': g.user.dump() if g.user is not None else None,
        'pins': query_front_page_data(),
    }
    return render_template('index.jinja', initial_data=initial_data)


@blueprint.route('/user/<username>')
def route_user(username):
    fourOhFour = False
    if username is None:
        fourOhFour = True
    else:
        user = User.query.get(username or g.user.name)
        if user == None:
            fourOhFour = True

    if fourOhFour:
        initial_data = {'error': 404}
        return render_template('index.jinja', initial_data=initial_data)

    initial_data = {
        'user': g.user.dump() if g.user is not None else None,
        'pageUser': user.dump(),
        'pins': query_pins(username=user.name, limit=INITIAL_PIN_COUNT),
    }
    return render_template('index.jinja', initial_data=initial_data)


@blueprint.route('/s/<string:short>')
def route_short(short):
    result = Pin.query.filter_by(short=short).all()
    if len(result) != 1:
        initial_data = {'error': 404}
        return render_template('index.jinja', initial_data=initial_data)

    return redirect(result[0].url)
