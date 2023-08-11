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
    isRecording = false;
    mediaRecorder.stop();
    recordButton.classList.remove('recording');

    // This function is triggered once the recording is stopped
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);

        let audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // WebM format
        sendDataToWebhook(audioBlob);
    };
}

function sendDataToWebhook(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recorded_audio.webm"); // Save as .webm

    fetch('https://hook.eu1.make.com/tpsid5dxn9b9mshdncjp0r7hed94qzcp', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error sending data:', error));
}
