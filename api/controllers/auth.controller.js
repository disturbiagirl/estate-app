import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  // hashSync uses await
  const newUser = new User({ username, email, password: hashedPassword })
  // password: hashedPassword needed to assign new value to json object
  try {
    await newUser.save()
    res.status(201).json("User created succesfully!")
  } catch (error) {
    next(error);
  }
};