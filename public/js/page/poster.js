/**
 * Created by jimmy on 8/9/15.
 */
$(function(){
    var editor = new Simditor({
        textarea: $('#editor'),
        upload:{
            url: '/post/upload',
            params: null,
            fileKey: 'fileDataFileName',
            leaveConfirm: '文件正在上传,你确定要离开吗？'
        }
    });
    $('#btn-submit').click(function(){
        var post={
            title:$('#poster-title').val(),
            content:$('.simditor-body').html(),
            tags:$('#tags-input').tagsinput('items'),
            user:$('#user-id').data('uid'),
            category:$('.category-value').val()
        };
        if($.trim(post.title)!=''&& $.trim(post.content)!=''&& $.trim(post.title).length<100){
            $.ajax({
                url:'/post/save',
                type:'POST',
                data:{post:post},
                success:function(data,status,e){
                    if(data.status==1){
                        window.location.href='post/detail/'+data.post;
                    }
                }
            })
        }else if($.trim(post.title).length>100){
            alert('标题不得超过100字');
        }else if($.trim(post.title)!=''&& $.trim('')!=''){
            alert('标题和内容不能为空');
        }
    })
});
