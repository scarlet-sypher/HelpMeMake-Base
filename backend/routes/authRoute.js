const express = require("express");
const passport = require("../config/passport");
const authController = require("../controller/authController");
const router = express.Router();

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/google", (req, res, next) => {
  console.log("Initiating Google OAuth flow...");

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,

    prompt: "select_account consent",
    access_type: "offline",
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google OAuth callback received");

    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.UI_URL}/signup?error=google_auth_failed`,
    })(req, res, (err) => {
      if (err) {
        console.error("Google OAuth callback error:", err);

        if (err.message === "USER_EXISTS") {
          return res.redirect(
            `${
              process.env.UI_URL
            }/login?error=account_exists&email=${encodeURIComponent(err.email)}`
          );
        }

        return res.redirect(
          `${process.env.UI_URL}/signup?error=google_auth_failed`
        );
      }

      next();
    });
  },
  authController.googleCallback
);

router.get("/github", (req, res, next) => {
  console.log("Initiating GitHub OAuth flow...");

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.clearCookie("debug_cookie");

  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })(req, res, next);
});

router.get(
  "/github/callback",
  (req, res, next) => {
    console.log("GitHub OAuth callback received");

    passport.authenticate("github", {
      session: false,
      failureRedirect: `${process.env.UI_URL}/signup?error=github_auth_failed`,
    })(req, res, (err) => {
      if (err) {
        console.error("GitHub OAuth callback error:", err);

        if (err.message === "USER_EXISTS") {
          return res.redirect(
            `${
              process.env.UI_URL
            }/login?error=account_exists&email=${encodeURIComponent(err.email)}`
          );
        }

        return res.redirect(
          `${process.env.UI_URL}/signup?error=github_auth_failed`
        );
      }

      next();
    });
  },
  authController.githubCallback
);

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/user", authenticateJWT, authController.getUser);
router.post("/set-role", authenticateJWT, authController.setRole);
router.post("/logout", authController.logout);

router.get("/test", authenticateJWT, (req, res) => {
  res.json({
    success: true,
    message: "JWT authentication is working!",
    user: req.user.email,
  });
});

module.exports = router;
