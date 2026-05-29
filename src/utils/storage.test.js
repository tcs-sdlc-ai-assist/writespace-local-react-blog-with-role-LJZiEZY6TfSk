import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getSession,
  setSession,
  clearSession,
} from './storage.js';

beforeEach(() => {
  localStorage.clear();
});

describe('getPosts', () => {
  it('returns an empty array when no posts exist', () => {
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('returns stored posts from localStorage', () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test',
        content: 'Content',
        author: 'user1',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
    const posts = getPosts();
    expect(posts).toEqual(mockPosts);
  });

  it('returns an empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_posts', 'not-valid-json');
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('returns an empty array when localStorage contains a non-array value', () => {
    localStorage.setItem('writespace_posts', JSON.stringify({ foo: 'bar' }));
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('returns an empty array when localStorage contains null', () => {
    localStorage.setItem('writespace_posts', JSON.stringify(null));
    const posts = getPosts();
    expect(posts).toEqual([]);
  });
});

describe('addPost', () => {
  it('adds a new post with generated id and timestamps', () => {
    const postObj = {
      title: 'My Post',
      content: 'Hello world',
      author: 'testuser',
      role: 'user',
    };
    const result = addPost(postObj);

    expect(result).toHaveProperty('id');
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
    expect(result.title).toBe('My Post');
    expect(result.content).toBe('Hello world');
    expect(result.author).toBe('testuser');
    expect(result.role).toBe('user');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
    expect(result.createdAt).toBe(result.updatedAt);

    const posts = getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe(result.id);
  });

  it('appends to existing posts', () => {
    addPost({ title: 'First', content: 'A', author: 'u1', role: 'user' });
    addPost({ title: 'Second', content: 'B', author: 'u2', role: 'admin' });

    const posts = getPosts();
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe('First');
    expect(posts[1].title).toBe('Second');
  });

  it('generates unique ids for each post', () => {
    const post1 = addPost({ title: 'A', content: 'A', author: 'u', role: 'user' });
    const post2 = addPost({ title: 'B', content: 'B', author: 'u', role: 'user' });
    expect(post1.id).not.toBe(post2.id);
  });
});

describe('updatePost', () => {
  it('updates an existing post and returns the updated post', () => {
    const post = addPost({ title: 'Original', content: 'Original content', author: 'u1', role: 'user' });
    const originalUpdatedAt = post.updatedAt;

    const updated = updatePost(post.id, { title: 'Updated Title', content: 'Updated content' });

    expect(updated).not.toBeNull();
    expect(updated.title).toBe('Updated Title');
    expect(updated.content).toBe('Updated content');
    expect(updated.author).toBe('u1');
    expect(updated.role).toBe('user');
    expect(updated.createdAt).toBe(post.createdAt);
    expect(updated).toHaveProperty('updatedAt');

    const posts = getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Updated Title');
  });

  it('returns null when post id does not exist', () => {
    const result = updatePost('nonexistent-id', { title: 'Nope' });
    expect(result).toBeNull();
  });

  it('only updates provided fields', () => {
    const post = addPost({ title: 'Title', content: 'Content', author: 'u1', role: 'user' });
    const updated = updatePost(post.id, { title: 'New Title' });

    expect(updated.title).toBe('New Title');
    expect(updated.content).toBe('Content');
  });
});

describe('deletePost', () => {
  it('deletes an existing post and returns true', () => {
    const post = addPost({ title: 'To Delete', content: 'Bye', author: 'u1', role: 'user' });
    const result = deletePost(post.id);

    expect(result).toBe(true);
    const posts = getPosts();
    expect(posts).toHaveLength(0);
  });

  it('returns false when post id does not exist', () => {
    const result = deletePost('nonexistent-id');
    expect(result).toBe(false);
  });

  it('only deletes the specified post', () => {
    const post1 = addPost({ title: 'Keep', content: 'A', author: 'u1', role: 'user' });
    const post2 = addPost({ title: 'Delete', content: 'B', author: 'u2', role: 'user' });

    deletePost(post2.id);

    const posts = getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe(post1.id);
  });
});

describe('getUsers', () => {
  it('returns an empty array when no users exist', () => {
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it('returns stored users from localStorage', () => {
    const mockUsers = [
      {
        id: '1',
        username: 'testuser',
        displayName: 'Test User',
        password: 'pass',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    localStorage.setItem('writespace_users', JSON.stringify(mockUsers));
    const users = getUsers();
    expect(users).toEqual(mockUsers);
  });

  it('returns an empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_users', '{broken');
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it('returns an empty array when localStorage contains a non-array value', () => {
    localStorage.setItem('writespace_users', JSON.stringify('string-value'));
    const users = getUsers();
    expect(users).toEqual([]);
  });
});

describe('addUser', () => {
  it('adds a new user with generated id and timestamp', () => {
    const userObj = {
      username: 'newuser',
      displayName: 'New User',
      password: 'secret',
      role: 'user',
    };
    const result = addUser(userObj);

    expect(result).toHaveProperty('id');
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
    expect(result.username).toBe('newuser');
    expect(result.displayName).toBe('New User');
    expect(result.password).toBe('secret');
    expect(result.role).toBe('user');
    expect(result).toHaveProperty('createdAt');

    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe(result.id);
  });

  it('defaults role to user when not provided', () => {
    const result = addUser({
      username: 'norole',
      displayName: 'No Role',
      password: 'pass',
    });
    expect(result.role).toBe('user');
  });

  it('uses provided role when specified', () => {
    const result = addUser({
      username: 'adminuser',
      displayName: 'Admin User',
      password: 'pass',
      role: 'admin',
    });
    expect(result.role).toBe('admin');
  });

  it('appends to existing users', () => {
    addUser({ username: 'u1', displayName: 'U1', password: 'p1', role: 'user' });
    addUser({ username: 'u2', displayName: 'U2', password: 'p2', role: 'admin' });

    const users = getUsers();
    expect(users).toHaveLength(2);
    expect(users[0].username).toBe('u1');
    expect(users[1].username).toBe('u2');
  });
});

describe('updateUser', () => {
  it('updates an existing user and returns the updated user', () => {
    const user = addUser({ username: 'u1', displayName: 'User One', password: 'pass', role: 'user' });
    const updated = updateUser(user.id, { displayName: 'Updated Name' });

    expect(updated).not.toBeNull();
    expect(updated.displayName).toBe('Updated Name');
    expect(updated.username).toBe('u1');
    expect(updated.password).toBe('pass');
  });

  it('returns null when user id does not exist', () => {
    const result = updateUser('nonexistent-id', { displayName: 'Nope' });
    expect(result).toBeNull();
  });
});

describe('deleteUser', () => {
  it('deletes an existing user and returns true', () => {
    const user = addUser({ username: 'todelete', displayName: 'Delete Me', password: 'pass', role: 'user' });
    const result = deleteUser(user.id);

    expect(result).toBe(true);
    const users = getUsers();
    expect(users).toHaveLength(0);
  });

  it('returns false when user id does not exist', () => {
    const result = deleteUser('nonexistent-id');
    expect(result).toBe(false);
  });

  it('only deletes the specified user', () => {
    const user1 = addUser({ username: 'keep', displayName: 'Keep', password: 'p', role: 'user' });
    const user2 = addUser({ username: 'remove', displayName: 'Remove', password: 'p', role: 'user' });

    deleteUser(user2.id);

    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe(user1.id);
  });
});

describe('getSession', () => {
  it('returns null when no session exists', () => {
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns the stored session object', () => {
    const mockSession = {
      username: 'admin',
      role: 'admin',
      displayName: 'Admin',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    };
    localStorage.setItem('writespace_session', JSON.stringify(mockSession));
    const session = getSession();
    expect(session).toEqual(mockSession);
  });

  it('returns null when localStorage contains invalid JSON for session', () => {
    localStorage.setItem('writespace_session', 'not-json');
    const session = getSession();
    expect(session).toBeNull();
  });
});

describe('setSession', () => {
  it('stores the session object in localStorage', () => {
    const sessionObj = {
      username: 'testuser',
      role: 'user',
      displayName: 'Test User',
      loggedInAt: '2024-01-01T00:00:00.000Z',
    };
    setSession(sessionObj);

    const raw = localStorage.getItem('writespace_session');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    expect(parsed).toEqual(sessionObj);
  });

  it('overwrites an existing session', () => {
    setSession({ username: 'first', role: 'user', displayName: 'First', loggedInAt: '' });
    setSession({ username: 'second', role: 'admin', displayName: 'Second', loggedInAt: '' });

    const session = getSession();
    expect(session.username).toBe('second');
    expect(session.role).toBe('admin');
  });
});

describe('clearSession', () => {
  it('removes the session from localStorage', () => {
    setSession({ username: 'u', role: 'user', displayName: 'U', loggedInAt: '' });
    clearSession();

    const session = getSession();
    expect(session).toBeNull();
    expect(localStorage.getItem('writespace_session')).toBeNull();
  });

  it('does not throw when no session exists', () => {
    expect(() => clearSession()).not.toThrow();
  });
});