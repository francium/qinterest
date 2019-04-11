import json

from flask import (
    g,
    jsonify,
    request,
    session,
)

from qinterest.consts import API_PIN_DEFAULT_OFFSET, API_PIN_DEFAULT_LIMIT
from qinterest.queries import query_pins, m_refresh_pin_cache
from qinterest.models import Pin, User
from qinterest import db
from . import blueprint


@blueprint.route('/user/<string:username>')
def route_api_user_based_on_id(username):
    user = User.query.get(username)
    if not user:
        return jsonify({'error': 404}), 404

    return jsonify(user.dump())


@blueprint.route('/pin', methods=['GET', 'DELETE', 'POST'])
def route_pin():
    if request.method == 'GET':
        # Pins by user
        if 'username' in request.args:
            username = request.args['username']
            offset = request.args.get('offset', API_PIN_DEFAULT_OFFSET)
            limit = request.args.get('limit', API_PIN_DEFAULT_LIMIT)
            data = query_pins(username=username, offset=offset, limit=limit)
            return jsonify(data)

        # Pins by all users
        offset = request.args.get('offset', API_PIN_DEFAULT_OFFSET)
        limit = request.args.get('limit', API_PIN_DEFAULT_LIMIT)
        data = query_pins(offset=offset, limit=limit)
        return jsonify(data)

    elif request.method == 'DELETE':
        id = request.args.get('id')

        if not id:
            return jsonify({'error': 400}), 400
        if not g.user:
            return jsonify({'error': 401}), 401

        pin = Pin.query.get(id)
        if not pin:
            return jsonify({'error': 404}), 404
        if g.user.name != pin.user.name:
            return jsonify({'error': 401}), 401

        db.session.delete(pin)
        db.session.commit()

        m_refresh_pin_cache()

        return 'OK', 200

    elif request.method == 'POST':
        if g.user is None:
            return 'Unauthorized', 401

        data = json.loads(request.data.decode())
        username = g.user.name
        url = data['url']
        user = User.query.get(username)
        pin = Pin(url=url, username=user.name)
        db.session.add(pin)
        db.session.commit()

        m_refresh_pin_cache()

        return jsonify(pin.dump()), 200
