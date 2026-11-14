const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      address: address || { country: 'India' },
      addresses: address && address.street ? [{
        name: name,
        phone: phone || '',
        houseFlat: address.houseFlat || address.street,
        street: address.street,
        landmark: address.landmark || '',
        city: address.city || '',
        state: address.state || '',
        pinCode: address.postalCode || '560001',
        isDefault: true
      }] : []
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to ShopNova!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Fetch user and include hidden password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address?.street || '',
        city: req.body.address.city || user.address?.city || '',
        state: req.body.address.state || user.address?.state || '',
        postalCode: req.body.address.postalCode || user.address?.postalCode || '',
        country: 'India'
      };
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate forgot password (OTP / reset token simulation)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address' });
    }

    // 6-digit OTP for realistic Indian verification flow
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = resetOtp;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Password reset OTP has been sent to ${email}`,
      simulatedOtp: resetOtp, // provided for convenient test verification
      resetToken: token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using OTP / Token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email, verification OTP and new password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please request a new one.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved addresses of user
// @route   GET /api/auth/addresses
// @access  Private
const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      addresses: user.addresses || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new Indian delivery address
// @route   POST /api/auth/addresses
// @access  Private
const addAddress = async (req, res, next) => {
  try {
    const { name, phone, houseFlat, street, landmark, city, state, pinCode, addressType, isDefault } = req.body;

    if (!name || !phone || !houseFlat || !street || !city || !state || !pinCode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required address fields: Name, Phone, House/Flat, Street, City, State, and PIN Code.'
      });
    }

    if (!/^\d{6}$/.test(pinCode)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit Indian PIN Code.' });
    }

    const user = await User.findById(req.user._id);

    const isFirstAddress = !user.addresses || user.addresses.length === 0;
    const shouldBeDefault = isDefault || isFirstAddress;

    if (shouldBeDefault && user.addresses) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    const newAddress = {
      name,
      phone,
      houseFlat,
      street,
      landmark: landmark || '',
      city,
      state,
      pinCode,
      addressType: addressType || 'Home',
      isDefault: shouldBeDefault
    };

    user.addresses.push(newAddress);

    // Keep primary legacy address synced
    if (shouldBeDefault) {
      user.address = {
        street: `${houseFlat}, ${street}${landmark ? ', Near ' + landmark : ''}`,
        city,
        state,
        postalCode: pinCode,
        country: 'India'
      };
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Delivery address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing address
// @route   PUT /api/auth/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const { name, phone, houseFlat, street, landmark, city, state, pinCode, addressType, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    if (name) address.name = name;
    if (phone) address.phone = phone;
    if (houseFlat) address.houseFlat = houseFlat;
    if (street) address.street = street;
    if (landmark !== undefined) address.landmark = landmark;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pinCode) {
      if (!/^\d{6}$/.test(pinCode)) {
        return res.status(400).json({ success: false, message: 'PIN code must be exactly 6 digits.' });
      }
      address.pinCode = pinCode;
    }
    if (addressType) address.addressType = addressType;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);

    // If default was deleted, assign first available as default
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address removed successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set address as default
// @route   PUT /api/auth/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let matched = false;

    user.addresses.forEach(addr => {
      if (addr._id.toString() === req.params.id) {
        addr.isDefault = true;
        matched = true;
        user.address = {
          street: `${addr.houseFlat}, ${addr.street}`,
          city: addr.city,
          state: addr.state,
          postalCode: addr.pinCode,
          country: 'India'
        };
      } else {
        addr.isDefault = false;
      }
    });

    if (!matched) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default delivery address updated',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's wishlist
// @route   GET /api/auth/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const existsIndex = user.wishlist.findIndex(id => id.toString() === productId);
    let action = 'added';

    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1);
      action = 'removed';
    } else {
      user.wishlist.push(productId);
      action = 'added';
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      action,
      message: action === 'added' ? 'Added item to your Wishlist!' : 'Removed item from your Wishlist',
      wishlist: updated.wishlist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getWishlist,
  toggleWishlist
};
