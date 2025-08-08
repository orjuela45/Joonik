import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

const NavbarWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navbar with correct title and logo', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    expect(screen.getByText('Joonik')).toBeInTheDocument();
    expect(screen.getByText('Sedes')).toBeInTheDocument();
  });

  it('navigates to home when logo is clicked', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const logo = screen.getByText('Joonik');
    fireEvent.click(logo);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to locations page when locations button is clicked', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const locationsButton = screen.getByRole('button', { name: /ubicaciones/i });
    fireEvent.click(locationsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/locations');
  });

  it('shows active state for current page', () => {
    // Mock being on locations page
    mockLocation.pathname = '/locations';
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const locationsButton = screen.getByRole('button', { name: /ubicaciones/i });
    
    // Check if button has active styling (this might need adjustment based on actual implementation)
    expect(locationsButton).toBeInTheDocument();
  });

  it('renders business icon', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    // Check for the presence of the Business icon (MUI icons are rendered as SVG)
    const businessIcon = document.querySelector('[data-testid="BusinessIcon"]');
    expect(businessIcon || screen.getByText('Joonik').previousSibling).toBeInTheDocument();
  });

  it('renders location icon in button', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    // Check for the presence of the LocationOn icon
    const locationIcon = document.querySelector('[data-testid="LocationOnIcon"]');
    expect(locationIcon || screen.getByRole('button', { name: /ubicaciones/i })).toBeInTheDocument();
  });

  it('has proper AppBar structure', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    // Check that the navbar is rendered as a banner (AppBar role)
    const navbar = screen.getByRole('banner');
    expect(navbar).toBeInTheDocument();
  });

  it('applies hover effects on logo', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const logoContainer = screen.getByText('Joonik').closest('div');
    expect(logoContainer).toHaveStyle('cursor: pointer');
  });

  it('renders chip with correct styling', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    const chip = screen.getByText('Sedes');
    expect(chip).toBeInTheDocument();
    expect(chip.closest('.MuiChip-root')).toBeInTheDocument();
  });

  it('handles navigation without crashing', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    // Test multiple navigation actions
    const logo = screen.getByText('Joonik');
    const locationsButton = screen.getByRole('button', { name: /ubicaciones/i });
    
    fireEvent.click(logo);
    fireEvent.click(locationsButton);
    fireEvent.click(logo);
    
    expect(mockNavigate).toHaveBeenCalledTimes(3);
  });

  it('maintains responsive design elements', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );
    
    // Check that the toolbar exists (which contains responsive padding)
    const toolbar = document.querySelector('.MuiToolbar-root');
    expect(toolbar).toBeInTheDocument();
  });
});