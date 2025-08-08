import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationForm from '../LocationForm';
import type { Location } from '../../types/location';

// Mock Material-UI components that might cause issues
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Dialog: ({ children, open, ...props }: any) => 
    open ? <div data-testid="dialog" {...props}>{children}</div> : null,
}));

const mockLocation: Location = {
  id: 1,
  code: 'TEST001',
  name: 'Test Location',
  image: 'https://example.com/image.jpg',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

describe('LocationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields when open', () => {
    render(<LocationForm {...defaultProps} />);
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/código/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/imagen/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<LocationForm {...defaultProps} open={false} />);
    
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('populates form fields when editing existing location', () => {
    render(<LocationForm {...defaultProps} location={mockLocation} />);
    
    expect(screen.getByDisplayValue('TEST001')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/image.jpg')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<LocationForm {...defaultProps} />);
    
    // Try to submit empty form by pressing Enter on an input
    const codeInput = screen.getByLabelText(/código/i);
    await user.type(codeInput, '{enter}');
    
    await waitFor(() => {
      expect(screen.getByText(/código es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
    });
  });

  it('validates code format', async () => {
    const user = userEvent.setup();
    render(<LocationForm {...defaultProps} />);
    
    const codeInput = screen.getByLabelText(/código/i);
    await user.type(codeInput, 'invalid'); // lowercase letters should fail
    await user.tab(); // Trigger validation by blurring the field
    
    await waitFor(() => {
      expect(screen.getByText(/código solo puede contener letras mayúsculas/i)).toBeInTheDocument();
    });
  });

  it('validates name length', async () => {
    const user = userEvent.setup();
    render(<LocationForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText(/nombre/i);
    await user.type(nameInput, 'a'); // Too short (only 1 character)
    await user.tab(); // Trigger validation by blurring the field
    
    await waitFor(() => {
      expect(screen.getByText(/nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates image URL format', async () => {
    const user = userEvent.setup();
    
    render(<LocationForm {...defaultProps} />);
    
    const codeInput = screen.getByLabelText(/código/i);
    const nameInput = screen.getByLabelText(/nombre/i);
    const imageInput = screen.getByLabelText(/imagen/i);
    
    await user.type(codeInput, 'TEST001');
    await user.type(nameInput, 'Test Location');
    await user.type(imageInput, 'invalid-url');
    
    // Trigger validation by blurring the field
    await user.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/debe ser una url válida/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn().mockResolvedValue(true);
    
    render(<LocationForm {...defaultProps} onSubmit={mockOnSubmit} />);
    
    const codeInput = screen.getByLabelText(/código/i);
    const nameInput = screen.getByLabelText(/nombre/i);
    const imageInput = screen.getByLabelText(/imagen/i);
    
    await user.type(codeInput, 'TEST001');
    await user.type(nameInput, 'Test Location');
    await user.type(imageInput, 'https://example.com/image.jpg');
    
    // Wait for form validation to complete
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /crear/i });
      expect(submitButton).not.toBeDisabled();
    });
    
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      code: 'TEST001',
      name: 'Test Location',
      image: 'https://example.com/image.jpg',
    });
  });

  it('shows loading state when loading prop is true', () => {
    render(<LocationForm {...defaultProps} loading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Something went wrong';
    render(<LocationForm {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();
    
    render(<LocationForm {...defaultProps} onClose={mockOnClose} />);
    
    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    await user.click(closeButton!);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();
    
    render(<LocationForm {...defaultProps} onClose={mockOnClose} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows update button text when editing', () => {
    render(<LocationForm {...defaultProps} location={mockLocation} />);
    
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });

  it('resets form when location prop changes', () => {
    const { rerender } = render(<LocationForm {...defaultProps} />);
    
    // Initially empty
    expect(screen.getByLabelText(/código/i)).toHaveValue('');
    
    // Rerender with location
    rerender(<LocationForm {...defaultProps} location={mockLocation} />);
    
    expect(screen.getByLabelText(/código/i)).toHaveValue('TEST001');
  });




});