$("#new").click(function (e) {
    e.preventDefault();
    $("#exampleModal").modal({
        title:'new message'
    });
});

function addList(mess,re) {
    var html = `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start" style="
    direction: rtl;
">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${mess}</h5>

                    </div>
                    <p class="mb-1">${re}</p>

                </a>`;

    $("#list").append($(html));
}

$("#save").click(function () {
    $.ajax({
        url:'/add',
        type:'POST',
        data:{
            mess:$("#mess").val(),
            re:$("#b").val()
        },

        success:function (data) {
            $("#exampleModal").modal('hide');
            var ob = JSON.parse(data);
            if (ob.error)
            {
                return;
            }
            addList(ob.mess,ob.re);
        }
    },

        );
});



$(function () {
    $.get('/cmds',function (res) {
        var ob = JSON.parse(res);
        for (var i in ob)
        {
            if (i !== '_no')
            addList(i,ob[i]);
        }
    });
});