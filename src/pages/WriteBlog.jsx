import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getPosts, addPost, updatePost } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';

/**
 * Blog post creation and editing form page.
 * Create mode at '/write', edit mode at '/edit/:id'.
 * Form with title and content fields, character counter, required field validation.
 * In edit mode, pre-fills form and enforces ownership (users can only edit own posts, admin can edit any).
 * On save, persists to localStorage with UUID (create) or updates existing (edit).
 * Cancel button navigates back without saving.
 * Includes Navbar.
 * @returns {JSX.Element}
 */
function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const allPosts = getPosts();
    const post = allPosts.find((p) => p.id === id);

    if (!post) {
      setNotFound(true);
      return;
    }

    // Enforce ownership: users can only edit their own posts, admin can edit any
    if (session && session.role !== 'admin' && post.author !== session.username) {
      navigate('/my-blogs', { replace: true });
      return;
    }

    setTitle(post.title);
    setContent(post.content);
  }, [id, isEditMode, session, navigate]);

  /**
   * Handle form submission.
   * Validates required fields, then creates or updates the post.
   * @param {React.FormEvent} e - form event
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('All fields are required.');
      return;
    }

    if (isEditMode) {
      const updated = updatePost(id, {
        title: trimmedTitle,
        content: trimmedContent,
      });

      if (!updated) {
        setError('Post not found. It may have been deleted.');
        return;
      }

      navigate(`/blog/${id}`, { replace: true });
    } else {
      if (!session) {
        setError('You must be logged in to create a post.');
        return;
      }

      addPost({
        title: trimmedTitle,
        content: trimmedContent,
        author: session.username,
        role: session.role,
      });

      navigate('/my-blogs', { replace: true });
    }
  }

  /**
   * Handle cancel button click.
   * Navigates back without saving.
   */
  function handleCancel() {
    if (isEditMode) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/my-blogs');
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <span className="text-5xl" aria-hidden="true">
              😕
            </span>
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Post Not Found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The post you&apos;re trying to edit doesn&apos;t exist or has been removed.
            </p>
            <button
              type="button"
              onClick={() => navigate('/my-blogs')}
              className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              ← Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {isEditMode
              ? 'Update your post below'
              : 'Share your thoughts with the community'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <span className="text-xs text-gray-400">
                  {title.length} characters
                </span>
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <span className="text-xs text-gray-400">
                  {content.length} characters
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-y"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              {isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default WriteBlog;