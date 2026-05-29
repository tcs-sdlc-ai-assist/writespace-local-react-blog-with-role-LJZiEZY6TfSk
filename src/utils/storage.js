import { v4 as uuidv4 } from 'uuid';

const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';
const SESSION_KEY = 'writespace_session';

/**
 * Safely parse JSON from localStorage with a fallback value.
 * @param {string} key - localStorage key
 * @param {*} fallback - fallback value if parsing fails
 * @returns {*} parsed value or fallback
 */
function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

// ─── Posts ───────────────────────────────────────────────────────────────────

/**
 * Get all posts from localStorage.
 * @returns {Array<Object>} array of post objects
 */
export function getPosts() {
  const posts = safeParse(POSTS_KEY, []);
  return Array.isArray(posts) ? posts : [];
}

/**
 * Add a new post to localStorage.
 * @param {{ title: string, content: string, author: string, role: string }} postObj
 * @returns {Object} the newly created post
 */
export function addPost(postObj) {
  const posts = getPosts();
  const now = new Date().toISOString();
  const newPost = {
    id: uuidv4(),
    title: postObj.title,
    content: postObj.content,
    author: postObj.author,
    role: postObj.role,
    createdAt: now,
    updatedAt: now,
  };
  posts.push(newPost);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return newPost;
}

/**
 * Update an existing post by id.
 * @param {string} postId - UUID of the post to update
 * @param {{ title?: string, content?: string }} updates - fields to update
 * @returns {Object|null} the updated post, or null if not found
 */
export function updatePost(postId, updates) {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    return null;
  }
  const now = new Date().toISOString();
  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: now,
  };
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return posts[index];
}

/**
 * Delete a post by id.
 * @param {string} postId - UUID of the post to delete
 * @returns {boolean} true if deleted, false if not found
 */
export function deletePost(postId) {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== postId);
  if (filtered.length === posts.length) {
    return false;
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
  return true;
}

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * Get all users from localStorage.
 * @returns {Array<Object>} array of user objects
 */
export function getUsers() {
  const users = safeParse(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

/**
 * Add a new user to localStorage.
 * @param {{ username: string, displayName: string, password: string, role?: string }} userObj
 * @returns {Object} the newly created user
 */
export function addUser(userObj) {
  const users = getUsers();
  const now = new Date().toISOString();
  const newUser = {
    id: uuidv4(),
    username: userObj.username,
    displayName: userObj.displayName,
    password: userObj.password,
    role: userObj.role || 'user',
    createdAt: now,
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
}

/**
 * Update an existing user by id.
 * @param {string} userId - UUID of the user to update
 * @param {Object} updates - fields to update
 * @returns {Object|null} the updated user, or null if not found
 */
export function updateUser(userId, updates) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return null;
  }
  users[index] = {
    ...users[index],
    ...updates,
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users[index];
}

/**
 * Delete a user by id.
 * @param {string} userId - UUID of the user to delete
 * @returns {boolean} true if deleted, false if not found
 */
export function deleteUser(userId) {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== userId);
  if (filtered.length === users.length) {
    return false;
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  return true;
}

// ─── Session ─────────────────────────────────────────────────────────────────

/**
 * Get the current session from localStorage.
 * @returns {Object|null} session object or null
 */
export function getSession() {
  return safeParse(SESSION_KEY, null);
}

/**
 * Set the current session in localStorage.
 * @param {{ username: string, role: string, displayName: string, loggedInAt: string }} sessionObj
 */
export function setSession(sessionObj) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}