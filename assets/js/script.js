let isRecording = false;
let mediaRecorder;
let audioChunks = [];

const recordButton = document.getElementById('recordButton');

// Desktop events
recordButton.addEventListener('mousedown', startRecording);
recordButton.addEventListener('mouseup', stopRecording);

// Mobile touch events
recordButton.addEventListener('touchstart', (e) => {
    e.preventDefault();  // Prevents the mouse event from being called
    startRecording();
});
recordButton.addEventListener('touchend', (e) => {
    e.preventDefault();  // Prevents the mouse event from being called
    stopRecording();
});
function startRecording() {
    if (isRecording) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                // Here you can convert the blob to MP3 using lamejs and then send it via webhook
            };
            mediaRecorder.start();
            isRecording = true;
            document.getElementById('recordButton').classList.add('recording');
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
        });
}

function stopRecording() {
    if (!isRecording) return;

    mediaRecorder.stop();
    isRecording = false;
    document.getElementById('recordButton').classList.remove('recording');
}
