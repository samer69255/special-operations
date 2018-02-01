//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48




 */


var token = "EAAUZBMi93K0kBAMYEZCQZCYNoi1PZAg7BmUHZClgyx63bYszhKHGNgCMgZC5YcOTY0mB7QVTqrjOsiwiBscR13XcZCLt4FTurpZC2Tf776TVCA8hvwhRWKr0MJHNyyZCaXZA2XYuBvLZCX1I7gU28caGDI9r8YOsmWeZCSMjUnCTAc6ASXlZCNUR0uYGq";
var Key = '9990';

var crypto = require('crypto');




const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var fs = require('fs');
var cookieParser = require('cookie-parser');
const app = express();
app.use(express.static('public'));



app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

// index
app.get('/', function (req, res) {
    if (req.cookies.login == encrypt(Key))
    res.sendFile(__dirname + '/index.html');
    else
    {
        res.writeHead(302, {
            Location: '/login',
        });
        res.end();
    }
});

app.get('/login', function (req, res) {
    if (isLogin(req))
    {
         res.writeHead(302, {
            Location: '/',
        });
         res.end();
    }
    else
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', function (req, res) {
    if (req.body.key == Key) {
        res.cookie('login',encrypt(Key), { maxAge: (60 * 60 * 1000)*30*24, httpOnly: true });
        res.writeHead(302, {
            Location: '/',
    });
        res.end();


    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }

});


// for facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'samer') {
        res.send(req.query['hub.challenge']);
        console.log(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong token');
    }
})

// to post data
app.post('/webhook/', function (req, res) {
    var cmds = get_Cmds();
   // console.log(cmds);
    var messaging_events = req.body.entry[0].messaging;
    console.log(messaging_events);
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            var re = undefined;

            for (var key in cmds)
            {
                if (text.indexOf(key) > -1)
                {
                    re = cmds[key];
                    break;
                }

            }

           if (re === undefined)
           {
               re = cmds._no;
           }
            if (re !== null)
            {
              sendTextMessage(sender,re);
            }




        }
        if (event.postback) {
            var text = JSON.stringify(event.postback);
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
            continue;
        }
    }
    res.sendStatus(200);
});

app.post('/settoken',function (req,res) {
    var _token = req.body.token;
    token = _token;
});


app.use(function (req,res,next) {
    if (!isLogin(req)) {
        res.writeHead(302, {
            Location: '/login',
        });
        res.end();
    }
    else
        next();
});

app.get('/cmds',function (req,res) {
    res.end(JSON.stringify(get_Cmds()));
});

app.post('/add',function (req,res) {
    var mess = req.body.mess;
    var re = req.body.re;
    if (mess && re)
    {
        var cmds = get_Cmds();
        if (cmds[mess]) {
         var   Res = {error:'تم ادخال امر موجود!'};
         res.end(JSON.stringify(Res));
        }
        else
        {
            var fs = require('fs');
            cmds[mess] = re;
            fs.writeFile('commands.json',JSON.stringify(cmds),function (error) {
                if(error) console.log(error);
                res.end(JSON.stringify({mess:mess,re:re}));

            });
        }

    }
    else


    res.end({'error':'الرجاء ملئ كافة الحقول'});
});


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN


function sendTextMessage(sender, text) {
    var messageData = { text:text };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}


function get_Cmds() {
    var fs = require('fs');
    //console.log(fs);
    var cmds = fs.readFileSync('commands.json').toString();
    return JSON.parse(cmds);
}


function encrypt(text){
    'use strict'
    var cipher = crypto.createCipher('aes-256-ctr','samer');
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function isLogin(req) {
    if (!req.cookies.login) return false;
    return req.cookies.login == encrypt(Key);
}


// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});
