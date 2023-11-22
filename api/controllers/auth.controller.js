import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // checks if user exists in the MongoDB database and if not shows an error
    const validUser = await User.findOne({ email: email });
    if (!validUser) return next(errorHandler(404, 'User not found!'))
    // compares encrypted password with user password and if it does not match shows an error
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    // This token will mix the user ID and App secret key witch is an environment variable
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
    // deconstract to remove password from passed data to user
    const { password: pass, ...rest } = validUser._doc;
    // saves token as a cookie. Http only does not allow other apps to access this cookie - makes it safer.
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
}