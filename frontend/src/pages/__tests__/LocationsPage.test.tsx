import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationsPage from '../LocationsPage';
import { useLocations } from '../../hooks/useLocations';
import type { Location } from '../../types';

// Mock the useLocations hook
jest.mock('../../hooks/useLocations');
const mockUseLocations = useLocations as jest.MockedFunction<typeof useLocations>;

// Mock LocationDialog component
jest.mock('../../components/LocationDialog', () => {
  return function MockLocationDialog({ open, onClose, onSave, location }: any) {
    if (!open) return null;
    
    return (
      <div data-testid="location-dialog">
        <h2>{location ? 'Edit Location' : 'Create Location'}</h2>
        <button onClick={() => onSave({ code: 'TEST', name: 'Test Location', image: 'test.jpg' })}>
          Save
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };
});

const mockLocations: Location[] = [
  {
    id: 1,
    code: 'LOC001',
    name: 'Location 1',
    image: 'https://example.com/image1.jpg',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    code: 'LOC002',
    name: 'Location 2',
    image: 'https://example.com/image2.jpg',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

const defaultMockReturn = {
  locations: mockLocations,
  loading: false,
  error: null,
  meta: null,
  links: null,
  fetchLocations: jest.fn(),
  createLocation: jest.fn(),
  updateLocation: jest.fn(),
  deleteLocation: jest.fn(),
  clearError: jest.fn(),
};

describe('LocationsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocations.mockReturnValue(defaultMockReturn);
  });

  it('renders locations page correctly', () => {
    render(<LocationsPage />);
    
    expect(screen.getByText('Gestión de Ubicaciones')).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('Location 2')).toBeInTheDocument();
    expect(screen.getByText('LOC001')).toBeInTheDocument();
    expect(screen.getByText('LOC002')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    });
    
    render(<LocationsPage />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to load locations';
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      error: errorMessage,
    });
    
    render(<LocationsPage />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows empty state when no locations', () => {
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      locations: [],
    });
    
    render(<LocationsPage />);
    
    expect(screen.getByText(/no hay ubicaciones disponibles/i)).toBeInTheDocument();
  });

  it('opens create dialog when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<LocationsPage />);
    
    const addButton = screen.getByLabelText(/agregar ubicación/i);
    await user.click(addButton);
    
    expect(screen.getByTestId('location-dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Location')).toBeInTheDocument();
  });

  it('opens edit dialog when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<LocationsPage />);
    
    const editButtons = screen.getAllByLabelText(/editar/i);
    await user.click(editButtons[0]);
    
    expect(screen.getByTestId('location-dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit Location')).toBeInTheDocument();
  });

  it('calls createLocation when saving new location', async () => {
    const user = userEvent.setup();
    const mockCreateLocation = jest.fn().mockResolvedValue(true);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      createLocation: mockCreateLocation,
    });
    
    render(<LocationsPage />);
    
    // Open create dialog
    const addButton = screen.getByLabelText(/agregar ubicación/i);
    await user.click(addButton);
    
    // Save location
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(mockCreateLocation).toHaveBeenCalledWith({
        code: 'TEST',
        name: 'Test Location',
        image: 'test.jpg',
      });
    });
  });

  it('calls updateLocation when saving existing location', async () => {
    const user = userEvent.setup();
    const mockUpdateLocation = jest.fn().mockResolvedValue(true);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      updateLocation: mockUpdateLocation,
    });
    
    render(<LocationsPage />);
    
    // Open edit dialog
    const editButtons = screen.getAllByLabelText(/editar/i);
    await user.click(editButtons[0]);
    
    // Save location
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(mockUpdateLocation).toHaveBeenCalledWith(
        mockLocations[0].id,
        {
          code: 'TEST',
          name: 'Test Location',
          image: 'test.jpg',
        }
      );
    });
  });

  it('calls deleteLocation when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockDeleteLocation = jest.fn().mockResolvedValue(true);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      deleteLocation: mockDeleteLocation,
    });
    
    render(<LocationsPage />);
    
    const deleteButtons = screen.getAllByLabelText(/eliminar/i);
    await user.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteLocation).toHaveBeenCalledWith(mockLocations[0].id);
    });
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<LocationsPage />);
    
    // Open dialog
    const addButton = screen.getByLabelText(/agregar ubicación/i);
    await user.click(addButton);
    
    expect(screen.getByTestId('location-dialog')).toBeInTheDocument();
    
    // Cancel dialog
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(screen.queryByTestId('location-dialog')).not.toBeInTheDocument();
  });

  it('closes dialog after successful save', async () => {
    const user = userEvent.setup();
    const mockCreateLocation = jest.fn().mockResolvedValue(true);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      createLocation: mockCreateLocation,
    });
    
    render(<LocationsPage />);
    
    // Open dialog
    const addButton = screen.getByLabelText(/agregar ubicación/i);
    await user.click(addButton);
    
    // Save location
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('location-dialog')).not.toBeInTheDocument();
    });
  });

  it('displays location images correctly', () => {
    render(<LocationsPage />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockLocations.length);
    
    expect(images[0]).toHaveAttribute('src', mockLocations[0].image);
    expect(images[1]).toHaveAttribute('src', mockLocations[1].image);
  });

  it('handles image loading errors gracefully', () => {
    render(<LocationsPage />);
    
    const images = screen.getAllByRole('img');
    
    // Simulate image error
    fireEvent.error(images[0]);
    
    // Should still render the card without crashing
    expect(screen.getByText('Location 1')).toBeInTheDocument();
  });

  it('renders action buttons for each location', () => {
    render(<LocationsPage />);
    
    const editButtons = screen.getAllByLabelText(/editar/i);
    const deleteButtons = screen.getAllByLabelText(/eliminar/i);
    
    expect(editButtons).toHaveLength(mockLocations.length);
    expect(deleteButtons).toHaveLength(mockLocations.length);
  });

  it('displays creation and update dates', () => {
    render(<LocationsPage />);
    
    // Check that dates are displayed (format may vary)
    expect(screen.getByText(/creado:/i)).toBeInTheDocument();
    expect(screen.getByText(/actualizado:/i)).toBeInTheDocument();
  });
});