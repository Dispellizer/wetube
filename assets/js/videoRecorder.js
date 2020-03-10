const recorderContainer = document.getElementById("jsRecorderContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = event => {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.mp3";
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start recording";
};

const startRecording = () => {
  // stream에서 가진 video를 recording해주는 함수
  videoRecorder = new MediaRecorder(streamObject);
  //   MediaRecorder는 기본값으로 전체 파일을 한번에 저장한다(녹화가 끝나야 저장함)
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  //   dataavailable는 녹화가 끝났을때 호출이 일어난다.
  recordBtn.addEventListener("click", stopRecording);
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
      //   video: { width: 1280, height: 720 }
    });
    // await를 쓰는 이유는 user가 우리한테 대답할떄까지 기다리기 위해서(권한설정)
    videoPreview.srcObject = stream;
    // stream이 object라 srcObject를 쓰나?
    videoPreview.muted = true;
    // 녹화를 하면서 소리를 듣기 싫기때문에 설정
    videoPreview.play();
    recordBtn.innerHTML = "Stop recording";
    streamObject = stream;
    startRecording();
  } catch (error) {
    recordBtn.innerHTML = "☹️ Cant record";
  } finally {
    // finally는 try나 catch가 실행 된 이후에 실행되는것
    recordBtn.removeEventListener("click", getVideo);
  }
};

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}
