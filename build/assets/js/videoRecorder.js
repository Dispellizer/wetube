"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var recorderContainer = document.getElementById("jsRecorderContainer");
var recordBtn = document.getElementById("jsRecordBtn");
var videoPreview = document.getElementById("jsVideoPreview");
var streamObject;
var videoRecorder;

var handleVideoData = function handleVideoData(event) {
  var videoFile = event.data;
  var link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.mp3";
  document.body.appendChild(link);
  link.click();
};

var stopRecording = function stopRecording() {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start recording";
};

var startRecording = function startRecording() {
  // stream에서 가진 video를 recording해주는 함수
  videoRecorder = new MediaRecorder(streamObject); //   MediaRecorder는 기본값으로 전체 파일을 한번에 저장한다(녹화가 끝나야 저장함)

  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData); //   dataavailable는 녹화가 끝났을때 호출이 일어난다.

  recordBtn.addEventListener("click", stopRecording);
};

var getVideo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var stream;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return navigator.mediaDevices.getUserMedia({
              audio: true //   video: { width: 1280, height: 720 }

            });

          case 3:
            stream = _context.sent;
            // await를 쓰는 이유는 user가 우리한테 대답할떄까지 기다리기 위해서(권한설정)
            videoPreview.srcObject = stream; // stream이 object라 srcObject를 쓰나?

            videoPreview.muted = true; // 녹화를 하면서 소리를 듣기 싫기때문에 설정

            videoPreview.play();
            recordBtn.innerHTML = "Stop recording";
            streamObject = stream;
            startRecording();
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            recordBtn.innerHTML = "☹️ Cant record";

          case 15:
            _context.prev = 15;
            // finally는 try나 catch가 실행 된 이후에 실행되는것
            recordBtn.removeEventListener("click", getVideo);
            return _context.finish(15);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12, 15, 18]]);
  }));

  return function getVideo() {
    return _ref.apply(this, arguments);
  };
}();

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}