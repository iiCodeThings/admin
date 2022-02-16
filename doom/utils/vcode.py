import string
import random


def generate_vcode(lenght=4):
    return "".join(random.sample(string.digits, lenght))
