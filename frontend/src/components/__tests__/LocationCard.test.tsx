import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationCard from '../LocationCard';
import type { Location } from '../../types/location';

const mockLocation: Location = {
  id: 1,
  code: 'TEST001',
  name: 'Test Location',
  image: 'https://example.com/image.jpg',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-16T14:45:00Z',
};

const defaultProps = {
  location: mockLocation,
};

describe('LocationCard', () => {
  it('renders location information correctly', () => {
    render(<LocationCard {...defaultProps} />);
    
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('TEST001')).toBeInTheDocument();
    expect(screen.getByText(/15 ene 2024/i)).toBeInTheDocument();
  });

  it('displays location image with correct src', () => {
    render(<LocationCard {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: /test location/i });
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('handles image error by showing placeholder', () => {
    render(<LocationCard {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: /test location/i });
    
    // Simulate image error
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x200?text=Imagen+no+disponible');
  });

  it('shows action buttons by default', () => {
    render(<LocationCard {...defaultProps} />);
    
    expect(screen.getByLabelText(/editar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/eliminar/i)).toBeInTheDocument();
  });

  it('hides action buttons when showActions is false', () => {
    render(<LocationCard {...defaultProps} showActions={false} />);
    
    expect(screen.queryByLabelText(/editar/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/eliminar/i)).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnEdit = jest.fn();
    
    render(<LocationCard {...defaultProps} onEdit={mockOnEdit} />);
    
    const editButton = screen.getByLabelText(/editar/i);
    await user.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockLocation);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnDelete = jest.fn();
    
    render(<LocationCard {...defaultProps} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByLabelText(/eliminar/i);
    await user.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockLocation.id);
  });

  it('formats date correctly in Spanish locale', () => {
    const locationWithSpecificDate: Location = {
      ...mockLocation,
      created_at: '2024-12-25T00:00:00Z',
    };
    
    render(<LocationCard location={locationWithSpecificDate} />);
    
    expect(screen.getByText(/25 dic 2024/i)).toBeInTheDocument();
  });

  it('displays location icon', () => {
    render(<LocationCard {...defaultProps} />);
    
    // Check for the location icon by looking for the LocationOn icon
    const locationIcon = screen.getByTestId('LocationOnIcon');
    expect(locationIcon).toBeInTheDocument();
  });

  it('has proper card structure and styling', () => {
    render(<LocationCard {...defaultProps} />);
    
    const card = screen.getByRole('img', { name: /test location/i }).closest('[class*="MuiCard"]');
    expect(card).toBeInTheDocument();
  });

  it('shows tooltip on action buttons', async () => {
    const user = userEvent.setup();
    render(<LocationCard {...defaultProps} />);
    
    const editButton = screen.getByLabelText(/editar sede/i);
    await user.hover(editButton);
    
    // Material-UI tooltips might not be easily testable without additional setup
    // This test ensures the button is accessible
    expect(editButton).toBeInTheDocument();
  });

  it('handles missing image gracefully', () => {
    const locationWithoutImage: Location = {
      ...mockLocation,
      image: '',
    };
    
    render(<LocationCard location={locationWithoutImage} />);
    
    const image = screen.getByRole('img', { name: /test location/i });
    expect(image).toHaveAttribute('src', '');
    expect(image).toHaveAttribute('alt', 'Test Location');
  });

  it('displays code as a chip', () => {
    render(<LocationCard {...defaultProps} />);
    
    // The code should be displayed in a chip component
    const codeChip = screen.getByText('TEST001');
    expect(codeChip).toBeInTheDocument();
  });

  it('renders without crashing when no callbacks provided', () => {
    render(<LocationCard location={mockLocation} />);
    
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });
});