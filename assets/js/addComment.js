import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");

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
  console.log(response);
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
