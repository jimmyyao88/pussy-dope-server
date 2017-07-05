/**
 * Created by jimmy on 6/18/15.
 */
    $(function(){
        var editor = new Simditor({
            textarea: $('#editor'),
            upload:{
                url: '/',
                params: null,
                leaveConfirm: '文件正在上传,你确定要离开吗？'
            }
        });
        $('#btn-reply').click(function(){
            var content=$('.simditor-body').html();
            $.ajax({
                type:'POST',
                data:{
                    reply:{
                        content:content,
                        post:$('#detail-wrapper').data('postid'),
                        user:$('#detail-wrapper').data('uid'),
                        replyTo:$('.detail-inner-wrapper').data('uid')
                    }
                },
                url:'/post/reply/save',
                beforeSend:function(){
                    $('.fa-refresh').show();
                },
                success:function(data,status,e){
                    if(data.status==1){
                        window.location.reload();
                    }
                },
                error:function(data,status,e){
                    alert('发帖失败');
                }
            })
        });
        $('.post-like-btn').click(function(){
            var _this=this;
            $.ajax({
                url:'/post/like',
                type:'POST',
                data:{pid:$('#detail-wrapper').data('postid')},
                success:function(data,status,e){
                    if(data.status==1){
                        $(_this).find('.like-num').text(data.like_num)
                    }else if(data.status==2){
                        alert('您已经赞过了哦');
                    }
                }
            })
        });

        $('.favorite-btn').click(function(){
            var _this=this;
            $.ajax({
                url:'/user/favorite',
                type:'POST',
                data:{pid:$('#detail-wrapper').data('postid')},
                success:function(data,status,e){
                    if(data.status==1){
                        $(_this).find('.inter-desc').text('已收藏');
                    }else if(data.status==2){
                        alert(2);
                    }
                }
            })
        });
        $('.btn-reply-get').click(function(){
            var uid=$(this).data('uid'),
                uname=$(this).data('uname'),
                floor=$(this).data('floor'),
                replyid=$(this).data('replyid');
            $('.detail-inner-wrapper').data('uid',uid);
            $('.simditor-body').html('<a style="color:#7AA87A" href=\"#'+replyid+'\">#'+floor+'楼</a><a href=\"/personal/'+uid+'\">@'+uname+'</a><span>&nbsp;</span>');
        })
    });
