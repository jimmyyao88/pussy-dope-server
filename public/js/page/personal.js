/**
 * Created by jimmy on 8/18/15.
 */
$(function(){
    $('.btn-edit').click(function(){
        $(this).hide();
        $('.card-desc').hide();
        $('.editor-wrapper').show();
    });

    var editor = new Simditor({
        textarea: $('#editor'),
        toolbarHidden:true
    });
    $('.btn-submit-sum').click(function(){
        var desc=$('.simditor-body').html();
        $.ajax({
            url:'/user/desc/save',
            type:'POST',
            data:{desc:desc},
            success:function(data,status,e){
                if(data.status==1){
                    $('.card-desc').html(data.desc);
                    $('.card-desc').show();
                    $('.editor-wrapper').hide();
                    $('.btn-edit').show();
                }
            }
        })
    })
});
