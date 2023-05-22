// ^ must add .js for every javascript imported file
import { User } from "../schema/userSchema.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const {
      firstName,
      lastName,
      followers,
      following,
      pinnedPosts,
      pinnedUsers,
    } = userData;

    res.status(200).send({
      status: "success",
      data: {
        id: userData._id,
        firstName,
        lastName,
        email,
        followers,
        following,
        pinnedPosts,
        pinnedUsers,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const logout = async (req, res) => {
  res.status(200).send("Success");
};

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  try {
    await User.create({ firstName, lastName, email, password });
    res.status(200).send("Successfull Registeration");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something Went Wrong");
  }
};
