import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts, deletePost } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';

/**
 * Authenticated blog listing page.
 * Displays all posts from localStorage in a responsive grid using BlogCard components.
 * Posts are sorted newest first.
 * Admin sees edit/delete on all posts; users see these only on their own.
 * Empty state with message and CTA to create first post.
 * Includes Navbar.
 * @returns {JSX.Element}
 */
function Home() {
  const session = getSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  /**
   * Load all posts from localStorage, sorted newest first.
   */
  function loadPosts() {
    const allPosts = getPosts();
    const sorted = allPosts
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(sorted);
  }

  /**
   * Handle deleting a post by id.
   * Only admins can delete any post; users can delete their own.
   * @param {string} postId - UUID of the post to delete
   */
  function handleDelete(postId) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (!session) return;

    if (session.role !== 'admin' && post.author !== session.username) return;

    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    deletePost(postId);
    loadPosts();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Posts</h1>
            <p className="mt-1 text-sm text-gray-600">
              Browse all posts from the community
            </p>
          </div>
          <Link
            to="/write"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            ✍️ Write Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <span className="text-5xl" aria-hidden="true">
              📝
            </span>
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              No posts yet
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Be the first to share something with the community!
            </p>
            <Link
              to="/write"
              className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                <BlogCard post={post} currentSession={session} />
                {session &&
                  (session.role === 'admin' || post.author === session.username) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="absolute top-3 right-12 inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                      aria-label={`Delete post: ${post.title}`}
                    >
                      🗑️
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;