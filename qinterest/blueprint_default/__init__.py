from flask import Blueprint

blueprint = Blueprint('default', __name__, template_folder='../templates')

from . import routes
