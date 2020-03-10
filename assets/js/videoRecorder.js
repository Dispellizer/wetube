const recorderContainer = document.getElementById("jsRecorderContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
      //   video: { width: 1280, height: 720 }
    });
    // await를 쓰는 이유는 user가 우리한테 대답할떄까지 기다리기 위해서(권한설정)
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    // 녹화를 하면서 소리를 듣기 싫기때문에 설정
    videoPreview.play();
  } catch (error) {
    recordBtn.innerHTML = "☹️ Cant record";
    recordBtn.removeEventListener("click", startRecording);
  }
};

function init() {
  recordBtn.addEventListener("click", startRecording);
}

if (recorderContainer) {
  init();
}
