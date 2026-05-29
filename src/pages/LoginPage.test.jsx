import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import * as auth from '../utils/auth.js';

vi.mock('../utils/auth.js', () => ({
  login: vi.fn(),
  getSession: vi.fn(),
}));

function renderLoginPage(initialEntries = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        <Route path="/my-blogs" element={<div>My Blogs Page</div>} />
        <Route path="/" element={<div>Landing Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.getSession.mockReturnValue(null);
  });

  describe('Form rendering', () => {
    it('renders the WriteSpace brand link', () => {
      renderLoginPage();

      expect(screen.getByText('✍️ WriteSpace')).toBeInTheDocument();
    });

    it('renders the Welcome Back heading', () => {
      renderLoginPage();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('renders the sign in description text', () => {
      renderLoginPage();

      expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
    });

    it('renders the username input field', () => {
      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(usernameInput).toHaveAttribute('placeholder', 'Enter your username');
    });

    it('renders the password input field', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
    });

    it('renders the Sign In submit button', () => {
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders the Create one link pointing to /register', () => {
      renderLoginPage();

      const createLink = screen.getByText('Create one');
      expect(createLink).toBeInTheDocument();
      expect(createLink.closest('a')).toHaveAttribute('href', '/register');
    });

    it('renders the brand link pointing to /', () => {
      renderLoginPage();

      const brandLink = screen.getByText('✍️ WriteSpace');
      expect(brandLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders the "Don\'t have an account?" text', () => {
      renderLoginPage();

      expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument();
    });
  });

  describe('Successful admin login', () => {
    it('redirects admin to /dashboard on successful login', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({
        success: true,
        session: {
          username: 'admin',
          role: 'admin',
          displayName: 'Admin',
          loggedInAt: '2024-01-01T00:00:00.000Z',
        },
      });

      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin');
      await user.click(submitButton);

      expect(auth.login).toHaveBeenCalledWith('admin', 'admin');
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  describe('Successful user login', () => {
    it('redirects user to /my-blogs on successful login', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({
        success: true,
        session: {
          username: 'testuser',
          role: 'user',
          displayName: 'Test User',
          loggedInAt: '2024-01-01T00:00:00.000Z',
        },
      });

      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass');
      await user.click(submitButton);

      expect(auth.login).toHaveBeenCalledWith('testuser', 'testpass');
      expect(screen.getByText('My Blogs Page')).toBeInTheDocument();
    });
  });

  describe('Failed login', () => {
    it('displays error message on invalid credentials', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({
        success: false,
        error: 'Invalid credentials.',
      });

      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      expect(auth.login).toHaveBeenCalledWith('wronguser', 'wrongpass');
      expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();
    });

    it('displays error message when fields are empty', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({
        success: false,
        error: 'All fields required.',
      });

      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);

      expect(auth.login).toHaveBeenCalledWith('', '');
      expect(screen.getByText('All fields required.')).toBeInTheDocument();
    });

    it('displays fallback error message when no error string is provided', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({
        success: false,
      });

      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'someuser');
      await user.type(passwordInput, 'somepass');
      await user.click(submitButton);

      expect(screen.getByText('Login failed.')).toBeInTheDocument();
    });

    it('clears previous error on new submission attempt', async () => {
      const user = userEvent.setup();
      auth.login
        .mockReturnValueOnce({
          success: false,
          error: 'Invalid credentials.',
        })
        .mockReturnValueOnce({
          success: true,
          session: {
            username: 'testuser',
            role: 'user',
            displayName: 'Test User',
            loggedInAt: '2024-01-01T00:00:00.000Z',
          },
        });

      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'wrong');
      await user.type(passwordInput, 'wrong');
      await user.click(submitButton);

      expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();

      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass');
      await user.click(submitButton);

      expect(screen.queryByText('Invalid credentials.')).not.toBeInTheDocument();
      expect(screen.getByText('My Blogs Page')).toBeInTheDocument();
    });

    it('does not display error message initially', () => {
      renderLoginPage();

      expect(screen.queryByText('Invalid credentials.')).not.toBeInTheDocument();
      expect(screen.queryByText('All fields required.')).not.toBeInTheDocument();
      expect(screen.queryByText('Login failed.')).not.toBeInTheDocument();
    });
  });

  describe('Redirect when already authenticated', () => {
    it('redirects admin to /dashboard when already logged in as admin', () => {
      auth.getSession.mockReturnValue({
        username: 'admin',
        role: 'admin',
        displayName: 'Admin',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLoginPage();

      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
      expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
    });

    it('redirects user to /my-blogs when already logged in as user', () => {
      auth.getSession.mockReturnValue({
        username: 'testuser',
        role: 'user',
        displayName: 'Test User',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLoginPage();

      expect(screen.getByText('My Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
    });

    it('does not redirect when no session exists', () => {
      auth.getSession.mockReturnValue(null);

      renderLoginPage();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
      expect(screen.queryByText('My Blogs Page')).not.toBeInTheDocument();
    });
  });

  describe('Form interaction', () => {
    it('updates username input value on typing', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'myusername');

      expect(usernameInput).toHaveValue('myusername');
    });

    it('updates password input value on typing', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, 'mypassword');

      expect(passwordInput).toHaveValue('mypassword');
    });

    it('calls getSession on mount to check authentication', () => {
      renderLoginPage();

      expect(auth.getSession).toHaveBeenCalled();
    });

    it('calls login with the entered username and password on submit', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({
        success: false,
        error: 'Invalid credentials.',
      });

      renderLoginPage();

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'hello');
      await user.type(passwordInput, 'world');
      await user.click(submitButton);

      expect(auth.login).toHaveBeenCalledWith('hello', 'world');
    });
  });
});