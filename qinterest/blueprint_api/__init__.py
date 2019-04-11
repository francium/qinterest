from flask import Blueprint

blueprint = Blueprint('api', __name__)

from . import routes
