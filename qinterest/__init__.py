from flask_github import GitHub
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
github = GitHub()

from .app import create_app
