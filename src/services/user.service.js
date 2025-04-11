const User = require('../models/user.model');

class UserService {
  async register(username, password) {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }]
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Create new user
    const user = new User({
      username,
      password,
    });

    await user.save();

    return {
      id: user._id,
      username: user.username,
      createdAt: user.createdAt
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService(); 