const express = require('express');
const { registerUser, 
        loginUser, 
        logout, 
        forgotPassword, 
        resetPassword, 
        getUserDetails, 
        updatePassword,
        updateProfile,
        getAllUsers,
        getUser,
        updateRole,
        deleteUser
      } = require("../controllers/userController")

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(isAuthenticatedUser, logout);

router.route("/me").get( isAuthenticatedUser ,getUserDetails);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);

router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizeRoles("admin"),getUser)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateRole)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);

module.exports = router;

