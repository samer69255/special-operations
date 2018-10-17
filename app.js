//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48




 */


var token = "EAAELRvdKfxEBAE2fSs2kfcC6oplBUYT4eUfn0KBjmPfPuKVPvpFdhKXZBfZCBSeYAexbkp7ahtvFYWZBqdlHDxRTd2iiSbZBYQZANSZCrc1gEOQ7TX7BNhio7aG7KqBVyieDJHPhCKOuztmDZBqQGHNd1AKNZCdLATUOvklfCtUOlwZDZD";
var Key = 'samersamer';
var token_chk = true;


var crypto = require('crypto');
const mysql = require('mysql');

var con = null;





function SqlConnect() {
    
   
        var data = require('./config.json');
     con = mysql.createPool(data);
   console.log('connected');
    
    
}
SqlConnect();

con.query('CREATE TABLE IF NOT EXISTS Users (id varchar(255),name varchar(255),token varchar(255))', err => {
    if (err) throw err;
    console.log('success');
    con.end();
//    SqlConnect();
//    con.query('DROP TABLE Users', err => {
//        if (err) throw err;
//        console.log('removed');
//    });
   
    
   
   
});







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

   // console.log(cmds);
    var messaging_events = req.body.entry[0].messaging;
    console.log(messaging_events);
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;



        if (event.message && event.message.text) {



            var text = event.message.text;
            text = text.replace(/\s{2,}/g,' ').trim();
            console.log(text);
            SqlConnect();
            
            con.query('SELECT * FROM Users WHERE id='+sender, (err,Res) => {
            if (err) throw err;
                
             if (Res.length == 0) {
                 if (text == 'ssm') {
                     con.query('INSERT INTO Users (id) VALUES ("'+ sender +'")', err => {
                         if (err) return console.log(err);
                         sendTextMessage(sender,'تم تسجيل الدخول');
                     });
                 }
                 con.end();
                 return;
             }
                if (text == 'init') {
                    var op = text.split(' ');
                    if (op && op.length == 2) {
                        SqlConnect();
                        con.query('UPDATE Users SET token = '+op[1]+' WHERE id = '+sender, err => {
                            if (err) return console.log(err);
                            con.end();
                            sendTextMessage(sender,'تم الحفظ');
                        });
                    }
                    return;
                }
              
    

        


            console.log('Starting');

            var re = null;
            var op = text.split(' ');
            var cmd = op[0];
            op.shift();
            var cmds = require('./cmds.js');
            
            if ((/[آ-ي]/).test(text)) {
                re = cmds.SUM(text);
            }
            else {
                var fun = cmds[cmd];
                if (fun == undefined) re = 'لم يتعرف على الامر';
            else {
                re = fun(op);
            }
            }
            





              sendTextMessage(sender,re);
                
                });





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
    if (_token.length > 16) {
        token = _token;
        res.end('success');
        token_chk = false;
    }
    else {
        res.end('error');
    }
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


app.post('/setmess',function (req,res) {
    var _mess = req.body.mess;
    if (_mess.length > 0) {
        var cmds = get_Cmds();
        if (_mess == '<no>') _mess = null;
        cmds['_no'] = _mess;
        save(JSON.stringify(cmds),function () {
            res.end('success');
        });


    }
    else {
        res.end('error');
    }
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
            {console.log('Error sending messages: ', error);
                token_chk = true;
            }
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
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



