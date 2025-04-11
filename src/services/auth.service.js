const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');

class AuthService {
  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  async logout(userId) {
    try {
      await User.findByIdAndUpdate(userId, { 
        refreshToken: null,
        lastLogoutAt: new Date()
      });
      return true;
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
      const user = await User.findById(decoded.userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user);
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  generateAccessToken(user) {
    return jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user._id },
      config.refreshTokenSecret,
      { expiresIn: config.refreshTokenExpiresIn }
    );
  }

  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid token');
      }

      return {
        userId: user._id.toString(),
        role: user.role
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService(); 