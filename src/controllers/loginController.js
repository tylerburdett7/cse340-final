import { body, validationResult } from 'express-validator';
import { findUserByEmail, createUser, verifyPassword } from '../models/loginModel.js';

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
 * Validation rules for registration form
 */
const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
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
 * Display the registration form
 */
const showRegisterForm = (req, res) => {
  res.render('auth/register', {
    title: 'Create Account',
    error: null,
    errors: [],
  });
};

/**
 * Process registration form submission
 */
const processRegister = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/register', {
      title: 'Create Account',
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).render('auth/register', {
      title: 'Create Account',
      error: 'Email address is already in use',
    });
  }

  // Create new user as customer
  const newUser = await createUser(email, password, 'customer');
  if (!newUser) {
    return res.status(500).render('auth/register', {
      title: 'Create Account',
      error: 'Error creating account. Please try again.',
    });
  }

  // Log them in automatically
  req.session.user = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    created_at: newUser.created_at,
  };

  res.redirect('/');
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

export {
  showLoginForm,
  showRegisterForm,
  processLogin,
  processRegister,
  processLogout,
  loginValidation,
  registerValidation,
};
