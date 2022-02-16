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

    ALI_SMS_ACCESS_KEY = 'LTAI4GAZQW662brMVDMAW2s3'
    ALI_SMS_ACCESS_SECRET = 'rYlkD0aFwb5z96gG42phhelN4t9WdP'

    POINTS_VS_RMB = 1
    TOTAL_PERCENT = 100


def get_config():
    return SysConfig("doom/settings.yaml")
