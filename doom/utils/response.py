import json
from flask import Response


class ErrorCode(object):
    OK = (0, "OK")
    PERMISSION_DENY = (1000, "permission deny")
    UNKNOWN_ERROR = (1001, "unknown error")
    MOBILE_INVALID = (1002, "mobile invalid")
    VCODE_INVALID = (1003, "vcode invalid")
    NO_SUCH_GOODS = (1004, "no such goods")
    NO_SUCH_USER = (1005, "no such user")
    NO_SUCH_OUTER_ORDER = (1006, "no such outer order")
    POINTS_NOT_ENOUGH = (1007, "points not enough")
    WX_PAYMENT_INIT_FAILED = (1008, "wechat payment init failed")
    WX_PAYMENT_FAILED = (1009, "wechat payment failed")
    WX_PREPAY_ID_FAILED = (1010, "wechat prepay id failed")
    WX_JS_TICKET_FAILED = (1011, "wechat js ticket failed")
    WX_GET_OPENID_FAILED = (1012, "wechat get openid failed.")
    NO_SUCH_ORDER = (1013, "no such order")
    VCODE_SEND_FAILED = (1014, "vcode send failed")
    OUTER_ORDER_HAS_USED = (1015, "该订单已经兑换过积分")


def build_response(error_code, data=None):
    response = {
        "meta": {
            "code": error_code[0],
            "msg": error_code[1]
        },
        "data": data
    }

    return Response(json.dumps(response), content_type="application/json")


CMS_ERROR_CODE = {
    "pwd_error": u'用户名或者密码错误'
}


def render_json(code, data=None):

    resp = {
        'code': code,
        'data': data
    }

    if code == 1:
        resp['data']['err_msg'] = CMS_ERROR_CODE[data['err_no']]

    return json.dumps(resp)
