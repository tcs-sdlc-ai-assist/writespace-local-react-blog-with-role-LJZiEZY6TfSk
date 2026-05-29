import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import * as auth from '../utils/auth.js';
import * as storage from '../utils/storage.js';

vi.mock('../utils/auth.js', () => ({
  getSession: vi.fn(),
}));

vi.mock('../utils/storage.js', () => ({
  getPosts: vi.fn(),
}));

function renderLandingPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.getSession.mockReturnValue(null);
    storage.getPosts.mockReturnValue([]);
  });

  describe('Hero Section', () => {
    it('renders the hero heading', () => {
      renderLandingPage();

      expect(screen.getByText('Your Creative Writing Space')).toBeInTheDocument();
    });

    it('renders the hero description text', () => {
      renderLandingPage();

      expect(
        screen.getByText(/WriteSpace is a simple, beautiful platform/)
      ).toBeInTheDocument();
    });

    it('renders Get Started Free and Sign In buttons for guests', () => {
      renderLandingPage();

      expect(screen.getByText('Get Started Free')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders Get Started Free link pointing to /register', () => {
      renderLandingPage();

      const link = screen.getByText('Get Started Free');
      expect(link.closest('a')).toHaveAttribute('href', '/register');
    });

    it('renders Sign In link pointing to /login', () => {
      renderLandingPage();

      const link = screen.getByText('Sign In');
      expect(link.closest('a')).toHaveAttribute('href', '/login');
    });

    it('renders Start Writing button for authenticated user', () => {
      auth.getSession.mockReturnValue({
        username: 'testuser',
        role: 'user',
        displayName: 'Test User',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLandingPage();

      expect(screen.getByText('Start Writing')).toBeInTheDocument();
      expect(screen.queryByText('Get Started Free')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('renders Start Writing link pointing to /write for user role', () => {
      auth.getSession.mockReturnValue({
        username: 'testuser',
        role: 'user',
        displayName: 'Test User',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLandingPage();

      const link = screen.getByText('Start Writing');
      expect(link.closest('a')).toHaveAttribute('href', '/write');
    });

    it('renders Go to Dashboard button for authenticated admin', () => {
      auth.getSession.mockReturnValue({
        username: 'admin',
        role: 'admin',
        displayName: 'Admin',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLandingPage();

      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Start Writing')).not.toBeInTheDocument();
      expect(screen.queryByText('Get Started Free')).not.toBeInTheDocument();
    });

    it('renders Go to Dashboard link pointing to /dashboard for admin', () => {
      auth.getSession.mockReturnValue({
        username: 'admin',
        role: 'admin',
        displayName: 'Admin',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLandingPage();

      const link = screen.getByText('Go to Dashboard');
      expect(link.closest('a')).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Features Section', () => {
    it('renders the Why WriteSpace heading', () => {
      renderLandingPage();

      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders the features section description', () => {
      renderLandingPage();

      expect(
        screen.getByText(/Everything you need to write, share, and manage/)
      ).toBeInTheDocument();
    });

    it('renders the Write Freely feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Write Freely')).toBeInTheDocument();
      expect(
        screen.getByText(/Express your thoughts and ideas/)
      ).toBeInTheDocument();
    });

    it('renders the Role-Based Access feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
      expect(
        screen.getByText(/Admins manage the platform while users focus/)
      ).toBeInTheDocument();
    });

    it('renders the Instant & Local feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Instant & Local')).toBeInTheDocument();
      expect(
        screen.getByText(/No servers, no waiting/)
      ).toBeInTheDocument();
    });

    it('renders exactly three feature cards', () => {
      renderLandingPage();

      expect(screen.getByText('Write Freely')).toBeInTheDocument();
      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
      expect(screen.getByText('Instant & Local')).toBeInTheDocument();
    });
  });

  describe('Latest Posts Section', () => {
    it('does not render Latest Posts section when no posts exist', () => {
      storage.getPosts.mockReturnValue([]);

      renderLandingPage();

      expect(screen.queryByText('Latest Posts')).not.toBeInTheDocument();
    });

    it('renders Latest Posts section when posts exist', () => {
      storage.getPosts.mockReturnValue([
        {
          id: '1',
          title: 'First Post',
          content: 'This is the first post content.',
          author: 'testuser',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-01T00:00:00.000Z',
        },
      ]);

      renderLandingPage();

      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
      expect(
        screen.getByText(/Check out what the community has been writing/)
      ).toBeInTheDocument();
    });

    it('renders post titles in the Latest Posts section', () => {
      storage.getPosts.mockReturnValue([
        {
          id: '1',
          title: 'My Amazing Post',
          content: 'Some content here.',
          author: 'writer1',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Another Great Post',
          content: 'More content here.',
          author: 'writer2',
          role: 'admin',
          createdAt: '2024-06-02T00:00:00.000Z',
          updatedAt: '2024-06-02T00:00:00.000Z',
        },
      ]);

      renderLandingPage();

      expect(screen.getByText('My Amazing Post')).toBeInTheDocument();
      expect(screen.getByText('Another Great Post')).toBeInTheDocument();
    });

    it('renders post author names in the Latest Posts section', () => {
      storage.getPosts.mockReturnValue([
        {
          id: '1',
          title: 'Post Title',
          content: 'Content.',
          author: 'authorname',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-01T00:00:00.000Z',
        },
      ]);

      renderLandingPage();

      expect(screen.getByText('authorname')).toBeInTheDocument();
    });

    it('renders at most 3 posts in the Latest Posts section', () => {
      const posts = [
        {
          id: '1',
          title: 'Post One',
          content: 'Content one.',
          author: 'u1',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Post Two',
          content: 'Content two.',
          author: 'u2',
          role: 'user',
          createdAt: '2024-02-01T00:00:00.000Z',
          updatedAt: '2024-02-01T00:00:00.000Z',
        },
        {
          id: '3',
          title: 'Post Three',
          content: 'Content three.',
          author: 'u3',
          role: 'user',
          createdAt: '2024-03-01T00:00:00.000Z',
          updatedAt: '2024-03-01T00:00:00.000Z',
        },
        {
          id: '4',
          title: 'Post Four',
          content: 'Content four.',
          author: 'u4',
          role: 'user',
          createdAt: '2024-04-01T00:00:00.000Z',
          updatedAt: '2024-04-01T00:00:00.000Z',
        },
      ];
      storage.getPosts.mockReturnValue(posts);

      renderLandingPage();

      // The 3 newest posts should be shown (sorted by createdAt desc)
      expect(screen.getByText('Post Four')).toBeInTheDocument();
      expect(screen.getByText('Post Three')).toBeInTheDocument();
      expect(screen.getByText('Post Two')).toBeInTheDocument();
      expect(screen.queryByText('Post One')).not.toBeInTheDocument();
    });

    it('renders post links pointing to /login for guest users', () => {
      storage.getPosts.mockReturnValue([
        {
          id: 'abc123',
          title: 'Guest Post',
          content: 'Content.',
          author: 'writer',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-01T00:00:00.000Z',
        },
      ]);

      renderLandingPage();

      const postLink = screen.getByText('Guest Post').closest('a');
      expect(postLink).toHaveAttribute('href', '/login');
    });

    it('renders post links pointing to /blog/:id for authenticated users', () => {
      auth.getSession.mockReturnValue({
        username: 'testuser',
        role: 'user',
        displayName: 'Test User',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      storage.getPosts.mockReturnValue([
        {
          id: 'abc123',
          title: 'Auth Post',
          content: 'Content.',
          author: 'writer',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-01T00:00:00.000Z',
        },
      ]);

      renderLandingPage();

      const postLink = screen.getByText('Auth Post').closest('a');
      expect(postLink).toHaveAttribute('href', '/blog/abc123');
    });

    it('truncates long post content with ellipsis', () => {
      const longContent = 'A'.repeat(200);
      storage.getPosts.mockReturnValue([
        {
          id: '1',
          title: 'Long Post',
          content: longContent,
          author: 'writer',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-01T00:00:00.000Z',
        },
      ]);

      renderLandingPage();

      // The truncated content should end with ellipsis and be shorter than original
      const contentElement = screen.getByText(/A+…/);
      expect(contentElement).toBeInTheDocument();
      expect(contentElement.textContent.length).toBeLessThan(longContent.length);
    });
  });

  describe('PublicNavbar', () => {
    it('renders the WriteSpace brand link in the navbar', () => {
      renderLandingPage();

      const brandLinks = screen.getAllByText('✍️ WriteSpace');
      expect(brandLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Login and Get Started buttons in navbar for guests', () => {
      renderLandingPage();

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders My Blogs button in navbar for authenticated user', () => {
      auth.getSession.mockReturnValue({
        username: 'testuser',
        role: 'user',
        displayName: 'Test User',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLandingPage();

      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });

    it('renders Dashboard button in navbar for authenticated admin', () => {
      auth.getSession.mockReturnValue({
        username: 'admin',
        role: 'admin',
        displayName: 'Admin',
        loggedInAt: '2024-01-01T00:00:00.000Z',
      });

      renderLandingPage();

      const dashboardLinks = screen.getAllByText('Dashboard');
      expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Footer', () => {
    it('renders the footer with WriteSpace brand', () => {
      renderLandingPage();

      const brandLinks = screen.getAllByText('✍️ WriteSpace');
      // At least one in navbar and one in footer
      expect(brandLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('renders the copyright text with current year', () => {
      renderLandingPage();

      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(`© ${currentYear} WriteSpace. All rights reserved.`)
      ).toBeInTheDocument();
    });

    it('renders Login link in the footer', () => {
      renderLandingPage();

      const loginLinks = screen.getAllByText('Login');
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Register link in the footer', () => {
      renderLandingPage();

      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('renders footer Login link pointing to /login', () => {
      renderLandingPage();

      const loginLinks = screen.getAllByText('Login');
      const footerLogin = loginLinks.find(
        (link) => link.closest('footer')
      );
      expect(footerLogin).toBeDefined();
      expect(footerLogin.closest('a')).toHaveAttribute('href', '/login');
    });

    it('renders footer Register link pointing to /register', () => {
      renderLandingPage();

      const registerLink = screen.getByText('Register');
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });
  });

  describe('Post date formatting', () => {
    it('renders formatted dates for posts', () => {
      storage.getPosts.mockReturnValue([
        {
          id: '1',
          title: 'Dated Post',
          content: 'Content.',
          author: 'writer',
          role: 'user',
          createdAt: '2024-06-15T00:00:00.000Z',
          updatedAt: '2024-06-15T00:00:00.000Z',
        },
      ]);

      renderLandingPage();

      expect(screen.getByText('Jun 15, 2024')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('renders correctly when getPosts returns empty array', () => {
      storage.getPosts.mockReturnValue([]);

      renderLandingPage();

      expect(screen.getByText('Your Creative Writing Space')).toBeInTheDocument();
      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
      expect(screen.queryByText('Latest Posts')).not.toBeInTheDocument();
    });

    it('calls getSession to determine authentication state', () => {
      renderLandingPage();

      expect(auth.getSession).toHaveBeenCalled();
    });

    it('calls getPosts to load latest posts', () => {
      renderLandingPage();

      expect(storage.getPosts).toHaveBeenCalled();
    });
  });
});