import sys
import redis
from flask import current_app


def configure_redis(app):

    pool = redis.ConnectionPool.from_url(app.config['REDIS'])
    app.config['REDIS'] = redis.Redis(connection_pool=pool)
    try:
        app.config['REDIS'].get('------foo------')
    except:
        sys.exit("Can not connect redis server, exit...")


def redis_set(key, value, expire=10 * 60):
    current_app.config['REDIS'].set(key, value, expire)


def redis_get(key):
    value = current_app.config['REDIS'].get(key)
    if value:
        return str(value, encoding='utf8')


def redis_set_expire(key, expire=30 * 24 * 60 * 60):
    current_app.config['REDIS'].expire(key, expire)
