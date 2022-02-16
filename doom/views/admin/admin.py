import urllib
from flask import request
from flask import url_for
from flask import redirect
from flask import render_template
from flask_login import login_user
from flask_login import logout_user
from flask_login import login_required
from doom.models import AdminUser
from doom.views.admin import LoginUser
from doom.utils.response import render_json
from . import admin_blueprint


@admin_blueprint.route('/', methods=['GET', 'POST'])
@admin_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = AdminUser.query.filter_by(
            active=True,
            mobile=request.form['mobile'],
            password=request.form['pwd']
        ).first()
        if not user:
            return render_json(1, {'err_no': 'pwd_error', 'input': 'pwd'})
        login_user(LoginUser(user))
        next = request.form.get('next', '')
        if next:
            next = urllib.unquote(next)
            return render_json(0, {'href': next, 'delaySuccess': True})
        return render_json(0, {'href': '/admin/dashboard', 'delaySuccess': True})
    return render_template('/login.html')


@admin_blueprint.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return redirect(url_for('admin.login'))


@admin_blueprint.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('/dashboard.html')
