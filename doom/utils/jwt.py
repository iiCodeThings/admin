from itsdangerous import URLSafeSerializer


class Jwt(object):

    def init_app(self, app):
        self.auth = app.config['JWT_AUTH']
        self.secret_key = app.config['JWT_SECRET_KEY']
        self.auth_s = URLSafeSerializer(self.secret_key, self.auth)

    def dumps(self, obj):
        return self.auth_s.dumps(obj)

    def loads(self, token):
        try:
            return self.auth_s.loads(token)
        except:
            return None
