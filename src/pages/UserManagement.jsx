import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';
import { getUsers, addUser, deleteUser } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';

/**
 * Admin-only user management page.
 * Displays all users (including hard-coded admin) with UserRow components.
 * Create User form at top with display name, username, password, and role fields.
 * Validates all fields and username uniqueness.
 * Delete confirms before removal. Hard-coded admin cannot be deleted. Self-deletion prevented.
 * Includes Navbar.
 * @returns {JSX.Element}
 */
function UserManagement() {
  const session = getSession();
  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Load all users from localStorage and prepend the hard-coded admin.
   */
  function loadUsers() {
    const storedUsers = getUsers();
    const hardCodedAdmin = {
      id: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
      createdAt: null,
    };
    setUsers([hardCodedAdmin, ...storedUsers]);
  }

  /**
   * Handle creating a new user.
   * Validates required fields and username uniqueness.
   * @param {React.FormEvent} e - form event
   */
  function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    // Check uniqueness against hard-coded admin
    if (trimmedUsername === 'admin') {
      setError('Username already exists.');
      return;
    }

    // Check uniqueness against localStorage users
    const existingUsers = getUsers();
    if (existingUsers.some((u) => u.username === trimmedUsername)) {
      setError('Username already exists.');
      return;
    }

    addUser({
      username: trimmedUsername,
      displayName: trimmedDisplayName,
      password: trimmedPassword,
      role,
    });

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${trimmedDisplayName}" created successfully.`);
    loadUsers();
  }

  /**
   * Handle deleting a user by id.
   * Confirms before removal.
   * @param {string} userId - UUID of the user to delete
   */
  function handleDelete(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    // Prevent deleting hard-coded admin
    if (user.username === 'admin') return;

    // Prevent self-deletion
    if (session && user.username === session.username) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${user.displayName}"?`
    );
    if (!confirmed) return;

    deleteUser(userId);
    setSuccess(`User "${user.displayName}" has been deleted.`);
    setError('');
    loadUsers();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage users on the platform
          </p>
        </div>

        {/* Create User Form */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New User</h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              All Users ({users.length})
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <span className="text-5xl" aria-hidden="true">
                👥
              </span>
              <h2 className="mt-4 text-lg font-bold text-gray-900">
                No users yet
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Create your first user using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentSession={session}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;