(function(){
    var playBtn = $('.video-play');

    $(playBtn).click(function(e){
        e.preventDefault();
        var thisHref = this.href,
            thisId = this.dataset.id,
            thisPart = this.dataset.part;

        var el_player = '<div id="id_video_container_'+thisId+'" style="width:100%;height100%;"></div>',
            el_container = '<div class="mask"></div><div class="f-video"><div class="v-close">x</div>';
            el_share = '<div class="v-tips"><div class="tips-item" id="share" data-href="'+thisHref+'">分享</div></div>';
        var option = {
            "auto_play":"0",
            "file_id": thisId,
            "app_id":"1254071830",
            "width":1280,
            "height":720,
            "https":1
        };

        if(thisPart == 'admin'){
            $('body').append(el_container+el_player+'</div>');
        }else{
            $('body').append(el_container+el_share+el_player+'</div>');
        }

        $('.mask').fadeIn();

        $('.f-video').fadeIn();

        new qcVideo.Player('id_video_container_'+thisId, option );
    })

    $(document).on('click','.v-close',function(){
        $('.mask').fadeOut(600);
        $('.f-video').fadeOut(600);
        var timer = setTimeout(function(){
            $('.mask').remove();
            $('.f-video').remove();
        },600);
    });

    $(document).on('click','.mask',function(){
        $('.mask').fadeOut(600);
        $('.f-video').fadeOut(600);
        var timer = setTimeout(function(){
            $('.mask').remove();
            $('.f-video').remove();
        },600);
    });

    $(document).on('click','#share',function(){
        alert('成功复制到剪贴板！')
    });

    new Clipboard('#share', {
        text: function(trigger) {
            return trigger.getAttribute('data-href');
        }
    });
}())
