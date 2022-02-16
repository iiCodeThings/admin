import os
import sys
import yaml


class SysConfig(object):

    DEBUG = True
    BUNDLE_ERRORS = True
    REVIEW_SWITCH = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True

    def __init__(self, config_file):
        if not os.path.isfile(config_file):
            sys.exit("can not find {}, exit...".format(config_file))

        with open(config_file, 'r') as handle:
            conf = yaml.load(handle, Loader=yaml.SafeLoader) or {}
            for k, v in conf.items():
                setattr(self, k, v)


def get_config():
    return SysConfig("doom/settings.yaml")
