import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords dont match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    // To Do: Register User
    try {
      const user = await User({
        // 사용자 생성
        name,
        email
      });
      await User.register(user, password);
      // 사용자 등록
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
  // passport.authenticate은 username과 password를 찾아보도록 설정되어있음
  // "local"은 우리가 설치해준 Strategy의 이름이다
  failureRedirect: routes.login,
  // 로그인 하는데 실패하면 로그인으로
  successRedirect: routes.home,
  // 로그인 성공시 홈으로
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check email and/or password"
});

export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});
// passport의 strategy중 github을 이용

export const githubLoginCallback = async (_, __, profile, cb) => {
  // cb함수는 인증에 성공한 상황해서 호출 해야한다.
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    // 깃헙으로 부터 온 email과 동일한 email을 가진 사용자를 찾는다.
    if (user) {
      // 동일한 email을 가진 user가 있으면 정보를 갱신한다
      user.githubId = id;
      // user.githubID를 github에서 가져온 id로 할당한다
      user.save();
      // 그리고 저장해줘야한다.
      return cb(null, user);
      // 이메일 동일한 사용자를 찾았을때 cb함수를 호출한다
      // 에러는 없음(null), user는 찾았습니다.
      // 그래서 이걸 쿠키에 저장할 수 있게 된다.
    }
    const newUser = await User.create({
      // 사용자를 찾지 못했으면 계정을 만든다.
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const postNaverLogin = (req, res) => {
  res.redirect(routes.home);
};

export const naverLogin = passport.authenticate("naver", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});

export const naverLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, profile_image: avatarUrl, nickname: name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.naverId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      naverId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const logout = (req, res) => {
  req.flash("info", "Logged Out, see you later");
  req.logout();
  // passport를 사용할때 이렇게 하면 로그아웃 된다.
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
      // req.user.avatarUrl은 현재 로그인한 사람의 아바타링크
      // 만약 여기 새로운 avatarfile이 없으면 업데이트 하지 않음
    });
    req.flash("success", "profile updated");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Cant update profile");
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) => {
  res.render("changePassword", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Password don't match");
      res.status(400);
      // 상태코드400을 안주면 브라우저는 성공적인걸로 알아서 크롬기준 비번을 저장하라고뜸
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    // changePassword는 passport-local-mongoose에서 제공해주는것
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't change password");
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
