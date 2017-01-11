//=========================================================
// Basic and simple generic conversation channel bot
//=========================================================

var restify         = require('restify');
var builder         = require('botbuilder');
var fs              = require("fs");
var XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;
var request         = require('request').defaults({ encoding: null });
var querystring     = require("querystring");


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, function () {
   console.log('%s listening to %s', server.name, server.url);
});

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// Create chat bot and enter credentials from dev.botframework.com
var connector = new builder.ChatConnector({
    appId: 'change-this-one-with-your-appid',
    appPassword: 'change-this-one-from-dev-dot-botframework'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Middleware
//=========================================================

var request = require('request');
function sendThis(api_url) {
  var r = request(api_url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	// Show the HTML for the Google homepage.
    return response.text
  }
  });
};

// Function to trigger some latency in the response
function sleepWell(s) {
  setTimeout(function() {
},s*1000);
}

// Anytime the major version is incremented any existing conversations will be restarted.

bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};


function helpButton (session) {
  var buttons = [];
    buttons.push(builder.CardAction.openUrl(session, "https://test.com/ask/question", "Ask Question"))
    buttons.push(builder.CardAction.call(session, "Call Our People", "+15105551234"));

    var attachments = [];
    var card = new builder.HeroCard(session, builder, 'Buttons', 'How can we help you? You can ask us some questions like What is  ..', buttons)
    attachments.push(card);

    var replyMessage = new builder.Message(session)
    .attachments(attachments);
    console.log(replyMessage)
  return replyMessage;
}

// First time Quick Reply
function quickReplyFirstTime(session) {
  let replyMessage = new builder.Message(session)
  .text('Hi there, do you want to  ...')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Subject A',
             payload:"Subject A",
             image_url:"https://test.com/images/image.png"
         },
         {
             content_type:"text",
             title:'Information',
             payload:"Information",
             image_url:"https://test.com/images/image.png"
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

// These are the simple quick reply sections that can be repeated if needed
function quickReply(session) {
  let replyMessage = new builder.Message(session)
  .text('Do you want to  ... ?')
  .sourceEvent({
     facebook: {
         quick_replies: [{
             content_type:"text",
             title:'Yes I do',
             payload:"Yes I do",
             image_url:"https://test.com/images/image.png"
         },
         {
             content_type:"text",
             title:'No',
             payload:"No",
             image_url:"https://test.com/images/image.png"
         },
         {
             content_type:"text",
             title:'Help',
             payload:"Help",
             image_url:'https://test.com/images/image.png'
         }]
     }
  });
  console.log(replyMessage)
  return replyMessage;
}

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/',
    function (session, results) {
		var id = new Date().toLocaleString();
    var message = session.message;

    var messageText 		= session.message.text;
    var messageAttachments 	= session.message.attachments;
    var firsttimer_quotes 	= ['hello','hi','about','yo','wassa','hallo'];
    var bye_quotes 			= ['bye bye','bye','later','see ya'];


    // handle all kind of simple triggers in FB

    if (messageText != '') {

      if (messageText.toLowerCase() == 'go') {
        session.send('This is the basic bot for green orange.');
      } else if (firsttimer_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleepWell(2)
        var replyMessage = quickReplyFirstTime(session)
        session.send(replyMessage);
      } else if (help_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleepWell(2)
        var replyMessage = helpButton(session)
        session.send(replyMessage)
      } else if (bye_quotes.contains(messageText.toLowerCase())) {
        session.sendTyping();
        sleepWell(2)
        session.send(':wave: goodbye and have a nice day.')
      } else if (messageText != '') {
        session.send('got it thanks')
      }
    } else {
      session.send('One moment please while we quickly process the image')
      session.sendTyping();
      sleepWell(5)
      session.send('This is the image name you have shared: ')
      session.send('Much obliged ')
    }
  }
 );
