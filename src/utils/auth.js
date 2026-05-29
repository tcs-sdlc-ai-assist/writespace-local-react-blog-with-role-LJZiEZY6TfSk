import { getUsers, addUser, getSession as storageGetSession, setSession, clearSession } from './storage.js';

/**
 * Log in a user with the given credentials.
 * Validates against the hard-coded admin account ('admin'/'admin') and localStorage users.
 * @param {string} username - the username to log in with
 * @param {string} password - the password to log in with
 * @returns {{ success: boolean, session?: Object, error?: string }}
 */
export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'All fields required.' };
  }

  // Hard-coded admin account
  if (username === 'admin' && password === 'admin') {
    const now = new Date().toISOString();
    const session = {
      username: 'admin',
      role: 'admin',
      displayName: 'Admin',
      loggedInAt: now,
    };
    setSession(session);
    return { success: true, session };
  }

  // Check localStorage users
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid credentials.' };
  }

  const now = new Date().toISOString();
  const session = {
    username: user.username,
    role: user.role,
    displayName: user.displayName,
    loggedInAt: now,
  };
  setSession(session);
  return { success: true, session };
}

/**
 * Register a new user.
 * Validates required fields, password match, and username uniqueness.
 * @param {{ username: string, displayName: string, password: string, confirmPassword: string }} userObj
 * @returns {{ success: boolean, session?: Object, error?: string }}
 */
export function register(userObj) {
  const { username, displayName, password, confirmPassword } = userObj || {};

  if (!username || !displayName || !password || !confirmPassword) {
    return { success: false, error: 'All fields required.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  // Username uniqueness check (including reserved 'admin')
  if (username === 'admin') {
    return { success: false, error: 'Username already exists.' };
  }

  const users = getUsers();
  if (users.some((u) => u.username === username)) {
    return { success: false, error: 'Username already exists.' };
  }

  // Create the new user via storage
  addUser({
    username,
    displayName,
    password,
    role: 'user',
  });

  const now = new Date().toISOString();
  const session = {
    username,
    role: 'user',
    displayName,
    loggedInAt: now,
  };
  setSession(session);
  return { success: true, session };
}

/**
 * Log out the current user by clearing the session.
 */
export function logout() {
  clearSession();
}

/**
 * Get the current session from localStorage.
 * @returns {Object|null} session object or null
 */
export function getSession() {
  return storageGetSession();
}