from hashlib import md5
from sqlalchemy import Column, Integer, String, Text

from . import db

class User(db.Model):
    name = Column(String(255), primary_key=True)
    github_access_token = Column(String(255))
    avatar = Column(String(512))

    def dump(self):
        return {
            'name': self.name,
            'avatar': self.avatar,
        }


class Pin(db.Model):
    id = db.Column(Integer, primary_key=True)
    url = db.Column(Text)
    short = db.Column(String(8), index=True, nullable=False, unique=True)
    username = db.Column(
        db.Integer, db.ForeignKey('user.name'), nullable=False)

    user = db.relationship('User', backref=db.backref('pins', lazy='joined'))

    def __init__(self, **kwargs):
        super(Pin, self).__init__(**kwargs)
        self.url = kwargs['url']
        self.username = kwargs['username']

        short = md5(self.url.encode('utf-8')).hexdigest()[:8]
        while len(Pin.query.filter_by(short=short).all()) != 0:
            short = md5(short.encode('utf-8')).hexdigest()[:8]

        self.short = short

    def dump(self):
        return {
            'id': self.id,
            'url': self.url,
            'short': self.short,
            'username': self.username,
            'user_avatar': self.user.avatar,
        }
