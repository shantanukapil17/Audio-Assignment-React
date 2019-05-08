import React from 'react';
import { async } from 'q';
import ButtonExampleLabeledIcon from './ButtonExampleLabeledIcon';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        recorder:null
    }
  }
  
  recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => {
        console.log(mediaRecorder)
        mediaRecorder.start();
    }

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });
  
  toggleAction=async ()=>
  {
    const recButton=document.getElementById("recButton");
    if(recButton.classList.contains("notRec")){
      this.state.recorder=await this.recordAudio();
      recButton.classList.remove("notRec");
      recButton.classList.add("Rec");
      this.state.recorder.start();
    }
    else if(recButton.classList.contains("Rec")){
      recButton.classList.remove("Rec");
      recButton.classList.add("notRec");
      const audio = await this.state.recorder.stop();
      audio.play();
    }
  }

  render() {
    return (
        <div>  
          
        <p className="wrapper">
          <p align="left">
            <button id="recButton" onClick={this.toggleAction} className="notRec"> <i className="fas fa-microphone micBtn"></i></button>
          </p>    
        </p>
       
        
      </div>
    );
  }
}