import click
from doom.models import AdminUser


@click.command()
def create_admin_user():
    """create admin user"""
    from doom.app import create_app
    app = create_app()
    with app.app_context():
        params = {
            'mobile': '15800000000',
            'password': '111111'
        }
        admin = AdminUser.create(**params)
        print(admin.to_dict())
