import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc  Register new user
// @route POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: ["agent", "owner"].includes(role) ? role : "buyer",
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
    token: generateToken(user._id),
  });
});

// @desc  Login user
// @route POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    },
    token: generateToken(user._id),
  });
});

// @desc  Get current user profile
// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc  Update profile
// @route PUT /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const { name, phone, company, avatar } = req.body;
  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.company = company ?? user.company;
  user.avatar = avatar ?? user.avatar;
  const updated = await user.save();
  res.json({ success: true, user: updated });
});
