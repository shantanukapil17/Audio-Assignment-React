import firebase from 'firebase/app';
import 'firebase/storage';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  };
  function customAlert(msg,duration)
  {
    var styler = document.createElement("div");
      styler.setAttribute("style","border: solid 5px Red;width:auto;height:auto;top:50%;left:40%;background-color:#444;color:Silver");
      styler.innerHTML = "<h3>"+msg+"</h3>";
      setTimeout(function()
      {
        styler.parentNode.removeChild(styler);
      },duration);
      document.body.appendChild(styler);
  }
  firebase.initializeApp(config);

  const storage=firebase.storage();

  const fileUploadToStorage=(fileObj)=>{
    const audioFileName=Math.random().toString(36).substring(2, 15)
    console.log(audioFileName)
    const uploadTask=storage.ref(`audioFiles/${audioFileName}.wav`).put(fileObj);
    customAlert("Uploading file to firebase","1500");
    uploadTask.on('state_changed' ,
    (snapshot)=>{
        console.log(snapshot)
    },
    (error)=>{
        console.log(error)
    },
    ()=>{
      alert("Completed the filename is "+audioFileName+".wav");
      console.log("Completed")
    });
}

export {
      storage, firebase, fileUploadToStorage as default
   }