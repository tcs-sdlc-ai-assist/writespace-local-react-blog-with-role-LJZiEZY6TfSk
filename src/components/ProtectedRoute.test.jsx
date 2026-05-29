import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import * as auth from '../utils/auth.js';

vi.mock('../utils/auth.js', () => ({
  getSession: vi.fn(),
}));

function renderWithRouter(initialEntries, element) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {element}
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login when no session exists', () => {
    auth.getSession.mockReturnValue(null);

    renderWithRouter(
      ['/protected'],
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when session exists and no role is required', () => {
    auth.getSession.mockReturnValue({
      username: 'testuser',
      role: 'user',
      displayName: 'Test User',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    });

    renderWithRouter(
      ['/protected'],
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('renders children when session role matches required role', () => {
    auth.getSession.mockReturnValue({
      username: 'admin',
      role: 'admin',
      displayName: 'Admin',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    });

    renderWithRouter(
      ['/admin'],
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <div>Admin Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/my-blogs" element={<div>My Blogs Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByText('My Blogs Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to /my-blogs when session role does not match required role', () => {
    auth.getSession.mockReturnValue({
      username: 'testuser',
      role: 'user',
      displayName: 'Test User',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    });

    renderWithRouter(
      ['/admin'],
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <div>Admin Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/my-blogs" element={<div>My Blogs Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('My Blogs Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when no session exists even with role prop', () => {
    auth.getSession.mockReturnValue(null);

    renderWithRouter(
      ['/admin'],
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <div>Admin Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/my-blogs" element={<div>My Blogs Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.queryByText('My Blogs Page')).not.toBeInTheDocument();
  });

  it('renders children for admin session when no role is required', () => {
    auth.getSession.mockReturnValue({
      username: 'admin',
      role: 'admin',
      displayName: 'Admin',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    });

    renderWithRouter(
      ['/protected'],
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects admin to /my-blogs when user role is required', () => {
    auth.getSession.mockReturnValue({
      username: 'admin',
      role: 'admin',
      displayName: 'Admin',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    });

    renderWithRouter(
      ['/user-only'],
      <Routes>
        <Route
          path="/user-only"
          element={
            <ProtectedRoute role="user">
              <div>User Only Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/my-blogs" element={<div>My Blogs Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('My Blogs Page')).toBeInTheDocument();
    expect(screen.queryByText('User Only Content')).not.toBeInTheDocument();
  });

  it('renders nested Outlet when no children are provided', () => {
    auth.getSession.mockReturnValue({
      username: 'testuser',
      role: 'user',
      displayName: 'Test User',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    });

    renderWithRouter(
      ['/parent/child'],
      <Routes>
        <Route path="/parent" element={<ProtectedRoute />}>
          <Route path="child" element={<div>Nested Child Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Nested Child Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('calls getSession to check authentication', () => {
    auth.getSession.mockReturnValue(null);

    renderWithRouter(
      ['/protected'],
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(auth.getSession).toHaveBeenCalled();
  });
});