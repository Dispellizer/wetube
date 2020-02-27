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
  successRedirect: routes.home
  // 로그인 성공시 홈으로
});

export const githubLogin = passport.authenticate("github");
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

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  console.log(accessToken, refreshToken, profile, cb);
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  // passport를 사용할때 이렇게 하면 로그아웃 된다.
  res.redirect(routes.home);
};

export const getMe = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

export const userDetail = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail" });
};
export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });
