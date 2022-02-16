import sys
import logging
from flask import Flask
from doom import commands
from flask import request
from doom.settings import get_config
from doom.extensions import db
from doom.extensions import migrate
from doom.extensions import login_manager
from doom.utils import configure_redis
from flask import render_template
from doom.views.admin import admin_blueprint


def create_app(config_object=get_config()):
    app = Flask(__name__)
    app.config.from_object(config_object)
    register_extensions(app)
    register_shellcontext(app)
    register_blueprints(app)
    register_commands(app)
    configure_logger(app)
    configure_redis(app)
    configure_hooks(app)
    return app


def register_blueprints(app):
    app.register_blueprint(admin_blueprint)


def register_extensions(app):
    """Register Flask extensions."""
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db, "app": app}

    app.shell_context_processor(shell_context)


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.create_admin_user)


def configure_logger(app):
    """Configure loggers."""
    handler = logging.StreamHandler(sys.stdout)
    if not app.logger.handlers:
        app.logger.addHandler(handler)


def configure_hooks(app):
    @app.before_request
    def before_request():
        pass

    @login_manager.unauthorized_handler
    def unauthorized():
        return render_template('unauthorized.html')

    @app.errorhandler(404)
    def errorhandler_404(info):
        return render_template('404.html', info=info)
