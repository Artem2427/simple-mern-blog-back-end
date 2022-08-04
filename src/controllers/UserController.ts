import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AuthType } from "../middleware/checkAuth";

import { RegisterBody } from "../types/user";

import User from "../models/User";

const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne(
      { email: req.body.email }
      // { passwordHash: 0 }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Inccorect login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "1h" }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something go wrong! Try it again" });
  }
};

const register = async (
  req: Request<{}, {}, RegisterBody, {}>,
  res: Response
) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // алгоритм шифрования
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "1h" }
    );

    // const { passwordHash, ...userData } = user._doc;
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to register",
    });
  }
};

const getMe = async (req: Request<{}, {}, AuthType, {}>, res: Response) => {
  try {
    const user = await User.findOne(
      { _id: req.body.userId },
      { passwordHash: 0 }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Not access" });
  }
};

export default { register, login, getMe };
