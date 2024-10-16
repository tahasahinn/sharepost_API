const AuthSchema = require("../models/auht.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await AuthSchema.findOne(email);

    if (user) {
      return res.status(500).json({ msg: "Böyle bir kullanıcı zaten" });
    }

    if (password.length < 6) {
      return res
        .status(500)
        .json({ msg: "Şifreniz 6 karakterden uzun olmalı !!" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    if (!isEmail(email)) {
      return res
        .status(500)
        .json({ msg: "Email formatı dışında bir şeyler girdiniz !! !!" });
    }

    const newUser = await AuthSchema.create({
      username,
      email,
      password: passwordHash,
    });

    const token = jwt.sign({ id: newUser._id }, "SECRET_KEY", {
      expiresIn: " 1h",
    });

    res.status(201).json({ status: "OK", newUser, token });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthSchema.findOne(email);

    if (!user) {
      return res.status(500).json({ msg: "Böyle bir kullanıcı bulunamadı" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res.status(500).json({ msg: "Girilen şifre yanlış " });
    }

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });

    res.status(200).json({ status: "OK", user, token });
  } catch (error) {
    res.status(200).json({ mesg: error });
  }
};

const isEmail = (emailAdress) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(emailAdress);
};

module.exports = { register, login };
