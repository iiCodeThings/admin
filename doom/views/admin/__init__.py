from flask import Blueprint
from doom.models import AdminUser
from flask_login import UserMixin
from doom.extensions import login_manager


class LoginUser(UserMixin):
    def __init__(self, user):
        self.user = user

    def get_id(self):
        return self.user.id


@login_manager.user_loader
def load_user(userid):
    user = AdminUser.get_by_id(userid)
    return LoginUser(user)


admin_blueprint = Blueprint('admin', __name__, static_folder='static',
                            template_folder='templates', url_prefix='/admin')


from .admin import (
    login,
    logout,
    dashboard
)

