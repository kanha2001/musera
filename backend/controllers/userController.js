const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    let avatarPath = "default.png";
    if (req.file) {
      avatarPath = req.file.filename;
    }
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarPath,
      role: role || "user",
    });
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Please Enter Email & Password" });
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. LOGOUT
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
};

// 4. FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it.`;
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });
    res
      .status(200)
      .json({ success: true, message: `Email sent to ${user.email}` });
  } catch (error) {
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    return res.status(500).json({ message: error.message });
  }
};

// 5. RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. UPDATE PASSWORD
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Old Password" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. GET MY PROFILE
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
    if (req.file) {
      const user = await User.findById(req.user.id);
      if (
        user.avatar &&
        user.avatar !== "default.png" &&
        typeof user.avatar === "string"
      ) {
        const oldFilename = user.avatar.split(/[/\\]/).pop();
        const oldFilePath = path.join(
          __dirname,
          "../public/uploads/users",
          oldFilename
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlink(oldFilePath, (err) => {
            if (err) console.log("Error deleting old image:", err);
          });
        }
      }
      newUserData.avatar = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// --- ADDRESS CONTROLLERS ---

// 9. Add New Address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 11. Get All Addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 12. Update Address
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const index = user.addresses.findIndex(
      (addr) => addr._id.toString() === req.params.id
    );
    if (index !== -1) {
      user.addresses[index] = { ...user.addresses[index]._doc, ...req.body };
      await user.save({ validateBeforeSave: false });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ADMIN CONTROLLERS ---

// 13. GET ALL USERS (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 14. DELETE USER (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.avatar && !user.avatar.includes("default.png")) {
      const filename = user.avatar.split(/[/\\]/).pop();
      const filePath = path.join(
        __dirname,
        "../public/uploads/users",
        filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting avatar:", err);
          }
        });
      }
    }
    await user.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEWLY ADDED FOR ADMIN UPDATE ---

// 15. GET SINGLE USER (Admin)
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User not found with id: ${req.params.id}` });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 16. UPDATE USER ROLE (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User not found with id: ${req.params.id}` });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
