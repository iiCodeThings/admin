"use strict"

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

/**
 * 按钮确认
 */
 $(function () {
  $(".btn-confirm").click(function () {
    var msg = $(this).attr("confirm-msg");
    if (!msg) {
      msg = "确定要执行此操作吗？";
    }
    return confirm(msg);
  });
 });

function parseRedirectUrl(search) {
  if (search) {
    return search.substr(1).split('=');
  }
}

/**
 * 表单提交
 */
var formSubmit = function() {
  // 阻止回车自动提交
  $("form input").keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      return false;
    }
  });

  var ajaxTimerId = 0;
  $(".btn-submit").click(function() {
    if (!$(this).is(":disabled")) {

      // btn-submit-confirm

      var form = $(this).parents('form'),
          action = form.attr("action"),
          method = form.attr("method"),
          btn = $(this);

      // prevent multiple clicks
      btn.prop("disabled", true);

      var formData = new FormData(form[0]);
      var result = parseRedirectUrl(window.location.search);
      if (result) {
        formData.append(result[0], result[1]);
      }

      $(form).find("input, select, img, radio, textarea").each(function() {
        if($(this).prop("type").toLowerCase()=='file') {

          formData.append(name, $(this)[0]);
        }
      });

      

      // Ajax submit function
      var ajaxSubmit = function() {
        if(ajaxTimerId != 0) {
            return false;
        }
        ajaxTimerId = setTimeout(function() {
            clearTimeout(ajaxTimerId);
            ajaxTimerId = 0;
        }, 3000);

        var settings = {
          method: method,
          url: action,
          dataType: "json",
          processData: false,
          contentType: false,
          data: formData
        };

        $.ajax(settings).done(function(resp) {
          // 请求 - 返回成功
          if (resp.code == 0) {
            btn.find(".label-success").removeClass("hide");
            // 需要延迟并显示成功信息
            if (typeof(resp.data.delaySuccess) != "undefined") {
              setTimeout(function () {
                if (typeof(resp.data.href) != "undefined") {
                  window.location.href = resp.data.href;
                } else if (typeof(resp.data.reload) != "undefined") {
                  window.location.reload();
                }
                
                btn.find(".label-success").addClass("hide");
                btn.prop("disabled", false);
              }, 3000);

            } else {

              if (typeof(resp.data.href) != "undefined") {
                window.location.href = resp.data.href;

              } else if (typeof(resp.data.reload) != "undefined") {
                window.location.reload();
              }

              btn.prop("disabled", false);
            }

          } else {
            btn.prop("disabled", false);
            var k = resp.data['input'],
                msg = resp.data['err_msg'];
            var formGroup = form.find("[name='"+k+"']").parents(".form-group");
            
            displayError(formGroup, msg);
          }

          (typeof(afterSubmit) != 'undefined' && afterSubmit != null) && afterSubmit(resp);

        }).fail(function(jqXHR, textStatus) {
          btn.prop("disabled", false);

          (typeof(afterSubmit) != 'undefined' && afterSubmit != null) && afterSubmit(resp);
        });
      };

      // execute beforeSubmit
      if (typeof(beforeSubmit) != 'undefined' && beforeSubmit != null) {
        beforeSubmit(function() {
          ajaxSubmit();
        });
      } else {
        ajaxSubmit();
      }
    }
  });

  // remove error message when the input focus
  $("form input,form select,form textarea").focus(function() {
    hideError($(this));
  });

  $("select").change(function() {
    hideError($(this));
  });
};

/**
 * 显示/隐藏表单错误提示
 */
var displayError = function (formGroup, msg) {
  formGroup.addClass("has-error");
  formGroup.find(".help-block").text(msg);
},
hideError = function ($subEle) {
  $subEle.parents(".form-group.has-error").find(".help-block").html("&nbsp;");
  $subEle.parents(".form-group.has-error").removeClass("has-error");
};

/**
 * 模态框
 */
$(function () {
  // 关闭模态框
  $(".modal").click(function (e) {
    if($(e.target.target).hasClass("close") || $(e.target).hasClass("btn-close")) {
      $(".modal-view").addClass("hide");
      $("html").css("overflow-y", "auto");
    }
  });

  // 打开模态框
  $(".btn-modal-raise").click(function () {
    var target = $(this).attr("modal-target");
    $("#"+target).removeClass("hide");
    $("html").css("overflow-y", "hidden");
    $(".modal")
  });
});


$(function () {
  $(".btn-refresh").click(function() {
    window.location.reload();
  });
});

/**
 * 版面切换
 */
$(function() {
  
  $(".nav-tabs li").click(function () {
    var $box = $(".tab-" + $(this).attr("role"));

    $(".nav-tabs li").removeClass("active");
    $(this).addClass("active");
    $(".tab-box").addClass("hide");
    $box.removeClass("hide");
  });
});

$(document).ready(function() {
  formSubmit();
});

/**
 * 学生手机号码验证
 */

var timer;
var isCounting = false;
var countDown = 60;

function setTimer(val){
  if(isCounting){
      val.attr('disabled','disabled');
      val.addClass('btn-disable');
       val.html("在"+ countDown + "秒后重新发送");
      countDown--;
      if(countDown<0){
          isCounting = false;
          countDown = 10;
      }
  }else{
      val.removeAttr('disabled');
      val.removeClass('btn-disable');
      val.html("发送验证码");
      clearTimeout(timer);
      return false;
  }
  timer = setTimeout(function(){
      setTimer(val);
  },1050);
}

$(function() {
  $('.verify-phone').click(function(e){//打开弹出框
    window.global_stu_id = $(this).parent().parent()[0].id;
    e.preventDefault();
    $('#checkModal').modal('show');
  });
});

$(function() {
  $('#send-vcode').click(function(e) {
    e.preventDefault();
    var that = this;
    var phone = $('#phone').val();
    var regexp = new RegExp('^[0-9]{11}$');
    if (regexp.test(phone)) {
      $.post('/school/vcode/send', {'phone': phone }, function(data, status) {
        var resp = JSON.parse(data);
        if (resp['code'] == 1) {
          alert('验证码发送失败。');
          isCounting = false;
        } else if (resp['code'] == 2) {
          alert('手机号已存在');
          isCounting = false;
        } else {
          isCounting = true;
          setTimer($(that));
        }
      });
    } else {
      $("#phone").val('手机号码错误');
    }
  });
});

$(function() {
  $('#verify-done').click(function(e) {
    var data = {
      'id': window.global_stu_id,
      'phone': $('#phone').val(),
      'vcode': $('#vcode').val()
    }
    $.post('/school/student/update', data, function(data, status) {
      var resp = JSON.parse(data);
      if (resp['code'] != 0) {
        alert("验证码不正确");
      } else {
        $('#checkModal').modal('hide');
        window.location.reload();
      }
    });
  });
});

$(function() {
  $('#verify-cancel').click(function(e) {
    isCounting = false;
    $('#phone').val('');
    $('#vcode').val('');
  });
});

/**
 * 将已验证的学生注册到Populele
 */
$(function() {
  $('.push-to-populele').click(function(e){
    window.global_stu_id = $(this).parent().parent()[0].id;
    e.preventDefault();
    var data = {
      'id': window.global_stu_id
    }
    $.post('/school/student/push', data, function(resp, status) {
      var r = JSON.parse(resp);
      alert(r['msg']);
      window.location.reload();
    });
  });
});

/**
 * 删除视频资料
 */
$(function() {
  $('.video-delete-confirm').click(function(e){
    var sure_delete = confirm("确定删除？");
    if (sure_delete) {
      window.global_video_id = $(this).parent().parent()[0].id;
      e.preventDefault();
      var data = {
        'id': window.global_video_id
      }
      $.post('/admin/video/delete', data, function(resp, status) {
        var r = JSON.parse(resp);
        if (r['code'] == 0) {
          alert("删除成功");
        }
        window.location.reload();
      });
    }
  });
});

/**
 * 删除机构学生
 */
$(function() {
  $('.student-delete-confirm').click(function(e){
    var sure_delete = confirm("确定删除？");
    if (sure_delete) {
      window.global_stu_id = $(this).parent().parent()[0].id;
      e.preventDefault();
      var data = {
        'id': window.global_stu_id
      }
      $.post('/school/student/delete', data, function(resp, status) {
        var r = JSON.parse(resp);
        if (r['code'] == 0) {
          alert("删除成功");
        }
        window.location.reload();
      });
    }
  });
});

$(function() {
  var myDate = new Date();
  var myDate = new Date();
  var y = myDate.getFullYear();
  var m = myDate.getMonth() + 1;
  var d = myDate.getDate() - 1;
  var s = y + '-' + m + '-' + d
  $('#datetimepicker').datetimepicker({
    lang:'ch',
    format:"Y-m-d",
    timepicker: false,
    maxDate: s
  });
})
