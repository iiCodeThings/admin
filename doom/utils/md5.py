import os
import shutil
import hashlib


class Md5Helper(object):

    def __init__(self, filename=None):
        self.filename = filename

    def md5(self):
        md5 = hashlib.md5()
        with open(self.filename, 'rb') as fp:
            md5.update(fp.read())
            return md5.hexdigest()

    def postfix(self):
        basename = os.path.basename(self.filename)
        if '.' in basename:
            dot = basename.rfind('.')
            return basename[dot : ]
        return ''

    def rename(self):
        dirname = os.path.dirname(self.filename)
        md5_path = os.path.join(dirname, '{}{}'.format(self.md5(), self.postfix()))
        shutil.move(self.filename, md5_path)
        return md5_path
