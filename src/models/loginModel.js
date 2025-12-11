import db from '../db/index.js';
import bcrypt from 'bcrypt';

/**
 * Find a user by email address for login verification
 * @param {string} email - Email address to search for
 * @returns {Promise<Object|null>} User object with password hash or null if not found
 */
const findUserByEmail = async (email) => {
  try {
    const result = await db.query(
      'SELECT id, email, password, role, created_at FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('DB Error in findUserByEmail:', error);
    return null;
  }
};

/**
 * Create a new user account
 * @param {string} email - User email
 * @param {string} password - Plain text password to hash
 * @param {string} role - User role (defaults to 'customer')
 * @returns {Promise<Object|null>} Created user object or null on error
 */
const createUser = async (email, password, role = 'customer') => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, hashedPassword, role]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('DB Error in createUser:', error);
    return null;
  }
};

/**
 * Verify a plain text password against a stored bcrypt hash
 * @param {string} plainPassword - The password to verify
 * @param {string} hashedPassword - The stored password hash
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

export { findUserByEmail, createUser, verifyPassword };
