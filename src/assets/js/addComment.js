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
  const spanText = document.createElement("span");
  const delBtn = document.createElement("button");
  spanText.className = "video__comments-text";
  spanText.innerHTML = comment;
  delBtn.className = "commentDelete";
  delBtn.innerHTML = `x`;
  delBtn.addEventListener("click", handleDeleteComment);
  li.appendChild(spanText);
  li.appendChild(delBtn);
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

const handleDeleteComment = async event => {
  const commentId = event.target.value;

  const response = await axios({
    url: `/api/comment/delete`,
    method: "POST",
    data: {
      commentId
    }
  });

  if (response.status === 200) {
    const commentDeleteButtonArray = document.getElementsByClassName(
      "commentDelete"
    );
    for (let i = 0; i < commentDeleteButtonArray.length; i += 1) {
      if (commentDeleteButtonArray[i].value === commentId) {
        commentDeleteButtonArray[i].parentElement.remove();
      }
    }
  }
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);

  const commentDeleteButtonArray = document.getElementsByClassName(
    "commentDelete"
  );
  for (let i = 0; i < commentDeleteButtonArray.length; i += 1) {
    commentDeleteButtonArray[i].addEventListener("click", handleDeleteComment);
  }
}

if (addCommentForm) {
  init();
}
