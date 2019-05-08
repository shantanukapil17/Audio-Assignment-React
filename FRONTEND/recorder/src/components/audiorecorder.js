import React from 'react';
import fileUploadToStorage from './Firebase/firebase';
import openSocket from 'socket.io-client';
import  recordAudio  from './recordapi';
import AudioPlayer from './audioPlayer';

const  socket = openSocket('http://localhost:3000');

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        recorder:null,
        url:'',
        textReceived:'',
        count:0
    }
    socket.on('trans_data',(data)=>{
      this.setState({textReceived:data})
    })
  }


  blobToBase64 = (blob, cb)=> {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      cb(base64);
    };
    reader.readAsDataURL(blob);
  };
  
  toggleAction=async ()=>
  {
    const recButton=document.getElementById("recButton");
    if(recButton.classList.contains("notRec")){
      this.state.recorder=await recordAudio();
      recButton.classList.remove("notRec");
      recButton.classList.add("Rec");
      this.state.recorder.start();
    }
    else if(recButton.classList.contains("Rec")){
      this.setState({
        count:this.state.count+1
      })
      recButton.classList.remove("Rec");
      recButton.classList.add("notRec");
      const audio = await this.state.recorder.stop();
      audio.play();
      const objectURL = URL.createObjectURL(audio.audioBlob);
      this.setState({
        url:objectURL
      })
      this.blobToBase64(audio.audioBlob, function(base64){ 
        socket.emit('new_message', {message : audio.audioBlob})
      });
      fileUploadToStorage(audio.audioBlob)    
  }
}

  render() {
    return (
      <div>  
          <div className="wrapper" align="left">
            <button id="recButton" onClick={this.toggleAction} className="notRec"> <i className="fas fa-microphone micBtn"></i></button>
            <AudioPlayer url={this.state.url}/>
          </div>      
          <h1>{this.state.textReceived}</h1><h2>You have recorded {this.state.count} times message.</h2>
      </div>
    );
  }
}