import pytest

from qinterest import create_app, db
from qinterest.models import User, Pin


@pytest.fixture
def app_blank_db():
    conf = {
        'SQLALCHEMY_DATABASE_URI': 'sqlite://',
        'TESTING': True,
    }
    app = create_app(conf)
    with app.app_context():
        db.create_all()
    return app


@pytest.fixture
def app_filled_db(app_blank_db):
    with app_blank_db.app_context():
        avatar = 'http://exmaple.com/avatar.jpg'
        username = 'user1'
        username2 = 'user2'
        users = [
            User(name=username, avatar=avatar),
            User(name=username2, avatar=avatar),
        ]
        pins = [
            Pin(url='url1', username=username),
            Pin(url='url2', username=username),
        ]
        db.session.add_all(users)
        db.session.add_all(pins)
        db.session.commit()
    return app_blank_db
