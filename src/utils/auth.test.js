import { describe, it, expect, beforeEach } from 'vitest';
import { login, register, logout, getSession } from './auth.js';
import { getUsers, getSession as storageGetSession, setSession, addUser } from './storage.js';

beforeEach(() => {
  localStorage.clear();
});

describe('login', () => {
  it('logs in the hard-coded admin with correct credentials', () => {
    const result = login('admin', 'admin');

    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
    expect(result.session.username).toBe('admin');
    expect(result.session.role).toBe('admin');
    expect(result.session.displayName).toBe('Admin');
    expect(result.session).toHaveProperty('loggedInAt');

    const session = storageGetSession();
    expect(session).not.toBeNull();
    expect(session.username).toBe('admin');
    expect(session.role).toBe('admin');
  });

  it('logs in a localStorage user with correct credentials', () => {
    addUser({
      username: 'testuser',
      displayName: 'Test User',
      password: 'testpass',
      role: 'user',
    });

    const result = login('testuser', 'testpass');

    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
    expect(result.session.username).toBe('testuser');
    expect(result.session.role).toBe('user');
    expect(result.session.displayName).toBe('Test User');
    expect(result.session).toHaveProperty('loggedInAt');

    const session = storageGetSession();
    expect(session).not.toBeNull();
    expect(session.username).toBe('testuser');
  });

  it('fails login with incorrect password for hard-coded admin', () => {
    const result = login('admin', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials.');
    expect(result.session).toBeUndefined();
  });

  it('fails login with incorrect password for localStorage user', () => {
    addUser({
      username: 'testuser',
      displayName: 'Test User',
      password: 'testpass',
      role: 'user',
    });

    const result = login('testuser', 'wrongpass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials.');
  });

  it('fails login with non-existent username', () => {
    const result = login('nonexistent', 'somepass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials.');
  });

  it('fails login with empty username', () => {
    const result = login('', 'password');

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails login with empty password', () => {
    const result = login('admin', '');

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails login with both fields empty', () => {
    const result = login('', '');

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails login with undefined credentials', () => {
    const result = login(undefined, undefined);

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('stores session in localStorage on successful login', () => {
    login('admin', 'admin');

    const session = storageGetSession();
    expect(session).not.toBeNull();
    expect(session.username).toBe('admin');
    expect(session.role).toBe('admin');
    expect(session.displayName).toBe('Admin');
    expect(session.loggedInAt).toBeDefined();
  });

  it('logs in a localStorage admin user with correct credentials', () => {
    addUser({
      username: 'adminuser',
      displayName: 'Admin User',
      password: 'adminpass',
      role: 'admin',
    });

    const result = login('adminuser', 'adminpass');

    expect(result.success).toBe(true);
    expect(result.session.username).toBe('adminuser');
    expect(result.session.role).toBe('admin');
    expect(result.session.displayName).toBe('Admin User');
  });
});

describe('register', () => {
  it('registers a new user with valid data', () => {
    const result = register({
      username: 'newuser',
      displayName: 'New User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
    expect(result.session.username).toBe('newuser');
    expect(result.session.role).toBe('user');
    expect(result.session.displayName).toBe('New User');
    expect(result.session).toHaveProperty('loggedInAt');

    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('newuser');
    expect(users[0].displayName).toBe('New User');
    expect(users[0].role).toBe('user');
  });

  it('sets session in localStorage on successful registration', () => {
    register({
      username: 'newuser',
      displayName: 'New User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    const session = storageGetSession();
    expect(session).not.toBeNull();
    expect(session.username).toBe('newuser');
    expect(session.role).toBe('user');
  });

  it('fails registration when username already exists in localStorage', () => {
    addUser({
      username: 'existinguser',
      displayName: 'Existing',
      password: 'pass',
      role: 'user',
    });

    const result = register({
      username: 'existinguser',
      displayName: 'Another User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Username already exists.');
  });

  it('fails registration when username is the reserved admin username', () => {
    const result = register({
      username: 'admin',
      displayName: 'Fake Admin',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Username already exists.');
  });

  it('fails registration when passwords do not match', () => {
    const result = register({
      username: 'newuser',
      displayName: 'New User',
      password: 'password123',
      confirmPassword: 'differentpassword',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Passwords do not match.');
  });

  it('fails registration when username is empty', () => {
    const result = register({
      username: '',
      displayName: 'New User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails registration when displayName is empty', () => {
    const result = register({
      username: 'newuser',
      displayName: '',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails registration when password is empty', () => {
    const result = register({
      username: 'newuser',
      displayName: 'New User',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails registration when all fields are missing', () => {
    const result = register({});

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails registration when called with undefined', () => {
    const result = register(undefined);

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('fails registration when called with null', () => {
    const result = register(null);

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields required.');
  });

  it('always registers new users with the user role', () => {
    const result = register({
      username: 'newuser',
      displayName: 'New User',
      password: 'pass',
      confirmPassword: 'pass',
    });

    expect(result.success).toBe(true);
    expect(result.session.role).toBe('user');

    const users = getUsers();
    expect(users[0].role).toBe('user');
  });
});

describe('logout', () => {
  it('clears the session from localStorage', () => {
    login('admin', 'admin');

    const sessionBefore = storageGetSession();
    expect(sessionBefore).not.toBeNull();

    logout();

    const sessionAfter = storageGetSession();
    expect(sessionAfter).toBeNull();
  });

  it('does not throw when no session exists', () => {
    expect(() => logout()).not.toThrow();
  });

  it('clears session after user login', () => {
    addUser({
      username: 'testuser',
      displayName: 'Test User',
      password: 'testpass',
      role: 'user',
    });

    login('testuser', 'testpass');
    expect(storageGetSession()).not.toBeNull();

    logout();
    expect(storageGetSession()).toBeNull();
  });
});

describe('getSession', () => {
  it('returns null when no session exists', () => {
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns the session after login', () => {
    login('admin', 'admin');

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session.username).toBe('admin');
    expect(session.role).toBe('admin');
    expect(session.displayName).toBe('Admin');
  });

  it('returns the session after registration', () => {
    register({
      username: 'newuser',
      displayName: 'New User',
      password: 'pass',
      confirmPassword: 'pass',
    });

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session.username).toBe('newuser');
    expect(session.role).toBe('user');
    expect(session.displayName).toBe('New User');
  });

  it('returns null after logout', () => {
    login('admin', 'admin');
    logout();

    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns the session set directly in localStorage', () => {
    const mockSession = {
      username: 'directuser',
      role: 'user',
      displayName: 'Direct User',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    };
    setSession(mockSession);

    const session = getSession();
    expect(session).toEqual(mockSession);
  });
});