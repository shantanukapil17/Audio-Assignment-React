const express = require('express')
const app = express()
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
var fs = require('fs');


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')

	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
         k=Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        socket.emit('trans_data',"Received it saving the file too. Thank you. Secret Key - "+k)
        var buf = new Buffer.from(data.message, 'base64'); // decode
        fs.writeFile("temp/test.wav", buf, function(err) {
          if(err) {
            console.log("err", err);
          } else {
            const fileName = './temp/test.wav';

            // Reads a local audio file and converts it to base64
            const file = fs.readFileSync(fileName);
            const audioBytes = file.toString('base64');
            
            // The audio file's encoding, sample rate in hertz, and BCP-47 language code
            const audio = {
              content: audioBytes,
            };
            const config = {
              encoding: 'LINEAR16',
              sampleRateHertz: 16000,
              languageCode: 'en-US',
            };
            const request = {
              audio: audio,
              config: config,
            };
            
            // Detects speech in the audio file
            client
              .recognize(request)
              .then(data => {
                const response = data[0];
                const transcription = response.results
                  .map(result => result.alternatives[0].transcript)
                  .join('\n');
                console.log(`Transcription: ${transcription}`);
                io.sockets.emit('new_message', {message : transcription});
              })
              .catch(err => {
                console.error('ERROR:', err);
              });
          }
        }); 
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})
