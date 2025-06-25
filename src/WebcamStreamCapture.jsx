import React from 'react';
import Webcam from 'react-webcam';

const WebcamStreamCapture = ({ capturing, onStart, onStop, currentIndex, recordingNumber }) => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [justStopped, setJustStopped] = React.useState(false); // NEW

  const handleStartCaptureClick = React.useCallback(() => {
    setRecordedChunks([]);
    setJustStopped(false); // reset stop flag
    onStart();

    const options = { mimeType: 'video/webm; codecs=vp8' };
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, options);
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
    };
    mediaRecorderRef.current.start();
  }, [onStart]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    onStop();
    setJustStopped(true); // set stop flag
  }, [onStop]);

  React.useEffect(() => {
    //  Only download if we have chunks AND just stopped
    if (justStopped && recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `question-${currentIndex + 1}-attempt-${recordingNumber}.webm`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setJustStopped(false); // reset stop flag after download
    }
  }, [justStopped, recordedChunks, currentIndex, recordingNumber]);

  return (
    <div className="webcam-container">
      <Webcam audio ref={webcamRef} className="webcam-view" />
      <div className="webcam-buttons">
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
      </div>
    </div>
  );
};

export default WebcamStreamCapture;
