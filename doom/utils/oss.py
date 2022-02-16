import oss2

class Oss2Helper(object):

    def __init__(self, config):
        self.access_id = config['OSS_ACCESS_KEY_ID']
        self.access_secret = config['OSS_ACCESS_KEY_SECRET']
        self.endpoint = config['OSS_ENDPOINT']
        self.buck_name = config['OSS_BUCKET_NAME']

        self.auth = oss2.Auth(self.access_id, self.access_secret)
        self.bucket = oss2.Bucket(self.auth, self.endpoint, self.buck_name)

    def upload_file(self, file, key):
        result = self.bucket.put_object_from_file(key, file)
        return result.status == 200
