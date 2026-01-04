import { render, screen } from '@testing-library/react';
import { NavButtonLink } from '@/components/molecules/NavButtonLink';
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('NavButtonLink', () => {
  it('renders the label correctly', () => {
    (useRouter as jest.Mock).mockReturnValue({ pathname: '/' });
    render(<NavButtonLink href='/test' label='Test Label' />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('has the correct href', () => {
    (useRouter as jest.Mock).mockReturnValue({ pathname: '/' });
    render(<NavButtonLink href='/test' label='Test Label' />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies secondary variant when active', () => {
    (useRouter as jest.Mock).mockReturnValue({ pathname: '/test' });
    const { container } = render(
      <NavButtonLink href='/test' label='Test Label' />
    );
    // The button should have the secondary variant class (usually contains 'bg-secondary')
    // Since we are using Shadcn, we can check for the class or just verify it renders
    expect(container.firstChild).toHaveClass('bg-secondary');
  });
});
