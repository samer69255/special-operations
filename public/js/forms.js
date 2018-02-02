// new click
$("#new").click(function (e) {
    e.preventDefault();
    $("#exampleModal").modal({
        title:'new message'
    });
});


// save on click
$("#save").click(function () {
    $("#status").text('');

    $(this).attr('disabled','true');

    var mess = $("#mess").val(),
        re = $("#b").val();


    if (mess && re)
        put(mess,re);
    else {
        $("#status").text('الرجاء ملئ البيانات كاملاً')
            .css({color:'#de171d'});
        $(this).removeAttr('disabled');
    }
});


// access token click

$("#acc_token").click(function () {
    $("#u_token").modal();
});

//update token click
$("#update").click(function () {

    $(this).attr('disabled',true);
    var ajax =  $.ajax({
        url:'/settoken',
        type:'POST',
        data:{
            token:$("#token").val()
        },
        success:function (res) {
            $("#update").removeAttr('disabled');
            if (res == 'success') {
                $("#u_token").modal('hide');
            }
            else $("t_status").text(res);
        },
        error:function (err) {
            alert(err);
        }
    });



});

// add click

$("#add").click(function () {

    var id = (function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    )();
    var html = `<div id="${id}">
<form class="form-inline">
  <input type="text" class="form-control mb-2 mr-sm-2 mb-sm-0" data-id="${id}"  placeholder="message">
  <input type="text" class="form-control mb-2 mr-sm-2 mb-sm-0" data-id="${id}"  placeholder="Re">
 

  

  <button class="save btn btn-warning" data-id="${id}">save</button>
  <button data-rm="${id}" class="close" style="
    padding: 10px;
    margin-right: 10px;
    font-size: 15px;
"><span style="color: red;">x</span></button>
</form>
</div>`;

    $("#l_m").append($(html));
    $($('input[data-id='+ id +']')[0]).focus();
    $(".close").click(close);
});


//

$("#set").click(function (e) {
    e.preventDefault();

    $('#set2').modal();
});


$("#set2").click(function () {

    var ms = $("#message").val();
    if (!ms) return;

    $(this).attr('disabled',true);
    var ajax =  $.ajax({
        url:'/setmess',
        type:'POST',
        data:{
            mess:ms
        },
        success:function (res) {
            $("#set").removeAttr('disabled');
            if (res == 'success') {
                $("#set2").modal('hide');
            }
            else $("s_status").text(res);
        },
        error:function (err) {
            alert(err);
        }
    });



});