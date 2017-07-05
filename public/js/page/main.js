/**
 * Created by jimmy on 8/29/15.
 */

$(function(){
    notice();
    $('.btn-signup').click(function(){
        checkUser();
    });
    $('.btn-signin').click(function(){
        checkLogin();
    })
});
function notice(){
    $.ajax({
        url:'/alert',
        type:'GET',
        success:function(data,status,e){
            if(data.unread){
                $('#alert-wrapper').html('<div class=\"round-alert\" style="top:0px;right:5px;\">'+data.notify_num+'</div>');
                $('#alert-wrapper-inner').html('<div class=\"round-alert\" style=\"display:inline-block;position:relative;margin-left:5px;\">'+data.notify_num+'</div>')
            }else{
            }
        },
        error:function(data,status,e){
        }
    });
}
function checkUser(){
    if (!$('#email-input').val().match(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/)){
        $('#email-input').popover('show');
        $('#email-input').focus(function(){
            $(this).popover('hide');
        })
    }else if($('#password-input').val().length<=5){
        $('#password-input').popover('show');
        $('#password-input').focus(function(){
            $(this).popover('hide');
        })
    }else if($('#name-input').val().length<=2) {
        $('#name-input').popover('show');
        $('#name-input').focus(function(){
            $(this).popover('hide');
        })
    }else{
        $.ajax({
            type:'POST',
            url:'/signup',
            data:{user:{email:$('#email-input').val(),name:$('#name-input').val(),password:$('#password-input').val()}},
            success:function(data){
                if(data.status==2){
                    window.location.reload();
                }else if(data.status==1){
                    $('.alert-signup').show(200);
                }
            }
        });
    }
}

function checkLogin(){
    if (!$('.signin-email').val().match(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/)){
        $('.signin-email').popover('show');
        $('.signin-email').focus(function(){
            $(this).popover('hide');
        })
    }else if($('.signin-password').val().length<=5){
        $('.signin-password').popover('show');
        $('.signin-password').focus(function(){
            $(this).popover('hide');
        })
    }else{
        $.ajax({
            type:'POST',
            url:'/signin',
            data:{user:{email:$('.signin-email').val(),password:$('.signin-password').val()}},
            success:function(data){
                if(data.status==2){
                    window.location.reload();
                }else if(data.status==1){
                    $('.alert-signin').show(200);
                }
            }
        });
    }
}