
function addList(mess,re) {
    mess = $('<div/>').text(mess).html();
    re = $('<div/>').text(re).html();

    var d = '' +
        '    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+ mess +'</button>\n' +
        '    <div class="dropdown-menu">\n' +
        '      <a class="dropdown-item" data-put="'+ mess +'" href="#">تعديل</a>\n' +
        '      <div class="dropdown-divider"></div>\n' +
        '      <a class="dropdown-item" data-rm="'+ mess +'" href="#">ازالة</a>\n' +
        '    </div>\n' +
        '  ';
    d = $(d);
    var html = '<a href="javascript:void(0)" id="'+ mess +'" class="list-group-item list-group-item-action flex-column align-items-start" style="\
    direction: rtl;\
">\
                    \
                    <p class="mb-1">'+ re +'</p>\
\
                </a>';

    $("#list").append($(html).prepend(d));
}





$(function () {
    $.get('/cmds',function (res) {
        var ob = JSON.parse(res);
        for (var i in ob)
        {
            if (i !== '_no' && i !== '__tok')
            addList(i,ob[i]);
        }
        if (ob.__tok === true)
        {
            $("#u_token").modal();
        }
    });
});

$(window).click(function (event) {
    if($(event.target).hasClass('save')) {
        event.preventDefault();
        var id = $(event.target).attr('data-id');
        // remove error mess
        removeErro(id);

        var mess = $('input[data-id="'+ id +'"]')[0].value,
          re =  $('input[data-id="'+ id +'"]')[1].value;
          if (mess && re) $(event.target).attr('disabled','disabled');
          else {
              return;
          }

        $.ajax({
                url:'/add',
                type:'POST',
                data:{
                    mess:mess,
                    re:re
                },

                success:function (data) {

                    var ob = JSON.parse(data);
                    if (ob.error)
                    {
                        addErro(id,ob.error);
                        $(event.target).removeAttr('disabled');
                        return;
                    }
                    addList(ob.mess,ob.re);
                    $('#'+id).remove();
                }
            },

        );


    }

    else if ($(event.target).hasClass('dropdown-item'))
    {
        event.preventDefault();
        if ($(event.target).attr('data-put'))
        {
            var mess = $(event.target).attr('data-put');
            var re = $('#'+ mess + ' p').text();
            $("#mess").val(mess);
            $("#b").val(re);
            $("#exampleModal").modal();

        }
        else {
            var s = $(event.target).attr('data-rm')
            if (!s) return;
            $.ajax({
                url:'/rm',
                type:'POST',
                data:{
                    mess:s,
                },
                success:function (data) {
                    if (data == 'success') $('#'+ s).remove();

                }
            });
        }
    }


});

function addErro(id,mess) {
    var h = '<i id="e-'+ id +'"class="now-ui-icons travel_info" data-toggle="tooltip" data-html="true" title="<span style=\'color:red;\'>'+mess+'</span>"</i>';
    $('#'+id+' form').append($(h));
    $('[data-toggle="tooltip"]').tooltip();
}

function removeErro(id) {
    $('#'+ 'e-' + id).remove('i');
}


$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// close click


function close(e) {
    e.preventDefault();

    var id = $(this).attr('data-rm');
    $('#'+id).remove();
}

function put(mess,re) {
    $.ajax({
        url:'/',
        type:'PUT',
        data:{
            mess:mess,
            re:re,
        },
        success:function (data) {
            if (data == 'success') {
                $("#exampleModal").modal("hide");
                $('#'+ mess + ' button').val(mess);
                $('#'+ mess + ' p').text(re);
                $("#save").removeAttr('disabled');

            }

        }
    });
}