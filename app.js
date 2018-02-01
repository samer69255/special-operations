//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48




 */

var token = "EAAUZBMi93K0kBAMYEZCQZCYNoi1PZAg7BmUHZClgyx63bYszhKHGNgCMgZC5YcOTY0mB7QVTqrjOsiwiBscR13XcZCLt4FTurpZC2Tf776TVCA8hvwhRWKr0MJHNyyZCaXZA2XYuBvLZCX1I7gU28caGDI9r8YOsmWeZCSMjUnCTAc6ASXlZCNUR0uYGq";


const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var fs = require('fs');
const app = express();

get_Cmds();

app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// index
app.get('/', function (req, res) {
    res.send('hello world i am a secret bot');
    res.end();
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
    console.log(cmds);
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
               re = cmds.no;
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
    var cmds = fs.readFileSync('commands.json').toString();
    return JSON.stringify(cmds);
}

// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});
