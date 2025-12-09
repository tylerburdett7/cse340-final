import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../models/loginModel.js';

/**
 * Validation rules for login form
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required'),
];

/**
 * Display the login form
 */
const showLoginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Admin Login',
    error: null,
    errors: [],
  });
};

/**
 * Process login form submission
 */
const processLogin = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/login', {
      title: 'Admin Login',
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    console.log('User not found:', email);
    return res.status(401).render('auth/login', {
      title: 'Admin Login',
      error: 'Invalid email or password',
    });
  }

  // Verify password
  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) {
    console.log('Invalid password for user:', email);
    return res.status(401).render('auth/login', {
      title: 'Admin Login',
      error: 'Invalid email or password',
    });
  }

  // Security: Remove password from user object before storing in session
  delete user.password;

  // Store user in session
  req.session.user = user;

  // Redirect to home
  res.redirect('/');
};

/**
 * Handle user logout
 */
const processLogout = (req, res) => {
  // Check if session exists
  if (!req.session) {
    return res.redirect('/');
  }

  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.clearCookie('connect.sid');
      return res.redirect('/');
    }

    // Clear session cookie from browser
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

/**
 * Display protected dashboard (requires login)
 */
export {
  showLoginForm,
  processLogin,
  processLogout,
  loginValidation,
};
