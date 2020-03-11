import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = comment => {
  // fake로 comment 만들기
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
      // 얘가 db로 넘겨주는건가??
      // pug에서 따로 input에 name 설정이 없었으니 그런듯
    }
  });
  if (response.status === 200) {
    // axios의 response status code가 200이면 db에 정상적으로 추가 됐다는 뜻
    addComment(comment);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  // submit 했을때 새로고침 안되게 하기 위해서 event를 막는다.
  const commentInput = addCommentForm.querySelector("input");
  //   addCommentForm 안에 있는 input을 querySelector로 찾아서 commentInput에 저장
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
