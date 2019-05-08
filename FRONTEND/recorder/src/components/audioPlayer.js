import React from 'react';

import ReactAudioPlayer from 'react-audio-player';

function AudioPlayer(url) {
  return (
    <div>
        <ReactAudioPlayer 
              src={url.url}
              autoPlay
              controls/>
    </div>
  );
}

export default AudioPlayer;


