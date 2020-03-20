"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var addCommentForm = document.getElementById("jsAddComment");
var commentList = document.getElementById("jsCommentList");
var commentNumber = document.getElementById("jsCommentNumber");

var increaseNumber = function increaseNumber() {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

var addComment = function addComment(comment) {
  // fake로 comment 만들기
  var li = document.createElement("li");
  var spanText = document.createElement("span");
  var delBtn = document.createElement("button");
  spanText.className = "video__comments-text";
  spanText.innerHTML = comment;
  delBtn.className = "commentDelete";
  delBtn.innerHTML = "x";
  delBtn.addEventListener("click", handleDeleteComment);
  li.appendChild(spanText);
  li.appendChild(delBtn);
  commentList.prepend(li);
  increaseNumber();
};

var sendComment = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(comment) {
    var videoId, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            videoId = window.location.href.split("/videos/")[1];
            _context.next = 3;
            return (0, _axios["default"])({
              url: "/api/".concat(videoId, "/comment"),
              method: "POST",
              data: {
                comment: comment // 얘가 db로 넘겨주는건가??
                // pug에서 따로 input에 name 설정이 없었으니 그런듯

              }
            });

          case 3:
            response = _context.sent;

            if (response.status === 200) {
              // axios의 response status code가 200이면 db에 정상적으로 추가 됐다는 뜻
              addComment(comment);
            }

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendComment(_x) {
    return _ref.apply(this, arguments);
  };
}();

var handleSubmit = function handleSubmit(event) {
  event.preventDefault(); // submit 했을때 새로고침 안되게 하기 위해서 event를 막는다.

  var commentInput = addCommentForm.querySelector("input"); //   addCommentForm 안에 있는 input을 querySelector로 찾아서 commentInput에 저장

  var comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

var handleDeleteComment = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
    var commentId, response, commentDeleteButtonArray, i;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            commentId = event.target.value;
            _context2.next = 3;
            return (0, _axios["default"])({
              url: "/api/comment/delete",
              method: "POST",
              data: {
                commentId: commentId
              }
            });

          case 3:
            response = _context2.sent;

            if (response.status === 200) {
              commentDeleteButtonArray = document.getElementsByClassName("commentDelete");

              for (i = 0; i < commentDeleteButtonArray.length; i += 1) {
                if (commentDeleteButtonArray[i].value === commentId) {
                  commentDeleteButtonArray[i].parentElement.remove();
                }
              }
            }

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function handleDeleteComment(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  var commentDeleteButtonArray = document.getElementsByClassName("commentDelete");

  for (var i = 0; i < commentDeleteButtonArray.length; i += 1) {
    commentDeleteButtonArray[i].addEventListener("click", handleDeleteComment);
  }
}

if (addCommentForm) {
  init();
}