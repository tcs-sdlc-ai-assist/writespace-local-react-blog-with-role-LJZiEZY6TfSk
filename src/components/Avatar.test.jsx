import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar, { getAvatar } from './Avatar.jsx';

describe('getAvatar', () => {
  it('returns crown emoji with violet background for admin role', () => {
    const { container } = render(getAvatar('admin'));
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('👑');
    expect(span).toHaveAttribute('aria-label', 'Admin avatar');
    expect(span.className).toContain('bg-violet-200');
    expect(span.className).toContain('text-violet-800');
  });

  it('returns book emoji with indigo background for user role', () => {
    const { container } = render(getAvatar('user'));
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('📖');
    expect(span).toHaveAttribute('aria-label', 'User avatar');
    expect(span.className).toContain('bg-indigo-200');
    expect(span.className).toContain('text-indigo-800');
  });

  it('returns user avatar for unknown role', () => {
    const { container } = render(getAvatar('unknown'));
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('📖');
    expect(span).toHaveAttribute('aria-label', 'User avatar');
    expect(span.className).toContain('bg-indigo-200');
  });

  it('returns user avatar when role is an empty string', () => {
    const { container } = render(getAvatar(''));
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('📖');
    expect(span).toHaveAttribute('aria-label', 'User avatar');
  });
});

describe('Avatar', () => {
  it('renders admin avatar when role is admin', () => {
    render(<Avatar role="admin" />);
    const span = screen.getByLabelText('Admin avatar');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('👑');
    expect(span.className).toContain('bg-violet-200');
    expect(span.className).toContain('text-violet-800');
  });

  it('renders user avatar when role is user', () => {
    render(<Avatar role="user" />);
    const span = screen.getByLabelText('User avatar');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('📖');
    expect(span.className).toContain('bg-indigo-200');
    expect(span.className).toContain('text-indigo-800');
  });

  it('renders user avatar for any non-admin role', () => {
    render(<Avatar role="editor" />);
    const span = screen.getByLabelText('User avatar');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('📖');
    expect(span.className).toContain('bg-indigo-200');
  });

  it('renders rounded-full class for proper avatar shape', () => {
    render(<Avatar role="admin" />);
    const span = screen.getByLabelText('Admin avatar');

    expect(span.className).toContain('rounded-full');
    expect(span.className).toContain('w-8');
    expect(span.className).toContain('h-8');
  });

  it('renders rounded-full class for user avatar shape', () => {
    render(<Avatar role="user" />);
    const span = screen.getByLabelText('User avatar');

    expect(span.className).toContain('rounded-full');
    expect(span.className).toContain('w-8');
    expect(span.className).toContain('h-8');
  });
});