import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationList from '../LocationList';
import { useLocations } from '../../hooks/useLocations';
import type { Location } from '../../types/location';

// Mock the useLocations hook
jest.mock('../../hooks/useLocations');
const mockUseLocations = useLocations as jest.MockedFunction<typeof useLocations>;

// Mock Material-UI components that might cause issues
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Dialog: ({ children, open, ...props }: any) => 
    open ? <div data-testid="dialog" {...props}>{children}</div> : null,
  Fab: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

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

const mockMeta = {
  current_page: 1,
  per_page: 12,
  total: 2,
  total_pages: 1,
  count: 2,
};

const defaultMockReturn = {
  locations: mockLocations,
  loading: false,
  error: null,
  meta: mockMeta,
  links: null,
  fetchLocations: jest.fn(),
  createLocation: jest.fn(),
  updateLocation: jest.fn(),
  deleteLocation: jest.fn(),
  clearError: jest.fn(),
};

describe('LocationList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocations.mockReturnValue(defaultMockReturn);
  });

  it('renders locations list correctly', () => {
    render(<LocationList />);
    
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
    
    render(<LocationList />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to load locations';
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      error: errorMessage,
    });
    
    render(<LocationList />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows empty state when no locations', () => {
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      locations: [],
      meta: { ...mockMeta, total: 0 },
    });
    
    render(<LocationList />);
    
    expect(screen.getByText(/no se encontraron ubicaciones/i)).toBeInTheDocument();
  });

  it('opens create form when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<LocationList />);
    
    const addButton = screen.getByLabelText(/agregar ubicación/i);
    await user.click(addButton);
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('filters locations by name', async () => {
    const user = userEvent.setup();
    render(<LocationList />);
    
    const nameInput = screen.getByLabelText(/buscar por nombre/i);
    await user.type(nameInput, 'Location 1');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    // The hook should be called with the filter
    expect(mockUseLocations).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Location 1',
      })
    );
  });

  it('filters locations by code', async () => {
    const user = userEvent.setup();
    render(<LocationList />);
    
    const codeInput = screen.getByLabelText(/buscar por código/i);
    await user.type(codeInput, 'LOC001');
    
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    await user.click(searchButton);
    
    expect(mockUseLocations).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'LOC001',
      })
    );
  });

  it('clears filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<LocationList />);
    
    // First add some filters
    const nameInput = screen.getByLabelText(/buscar por nombre/i);
    await user.type(nameInput, 'test');
    
    const clearButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(clearButton);
    
    expect(nameInput).toHaveValue('');
  });

  it('handles pagination correctly', async () => {
    const user = userEvent.setup();
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      meta: { ...mockMeta, total_pages: 3, current_page: 1 },
    });
    
    render(<LocationList />);
    
    // Should show pagination when there are multiple pages
    const pagination = screen.getByRole('navigation');
    expect(pagination).toBeInTheDocument();
  });

  it('opens edit form when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<LocationList />);
    
    const editButtons = screen.getAllByLabelText(/editar/i);
    await user.click(editButtons[0]);
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('opens delete confirmation when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<LocationList />);
    
    const deleteButtons = screen.getAllByLabelText(/eliminar/i);
    await user.click(deleteButtons[0]);
    
    expect(screen.getByText(/¿estás seguro/i)).toBeInTheDocument();
  });

  it('calls createLocation when form is submitted for new location', async () => {
    const user = userEvent.setup();
    const mockCreateLocation = jest.fn().mockResolvedValue(true);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      createLocation: mockCreateLocation,
    });
    
    render(<LocationList />);
    
    // Open create form
    const addButton = screen.getByLabelText(/agregar ubicación/i);
    await user.click(addButton);
    
    // Fill form
    await user.type(screen.getByLabelText(/código/i), 'LOC003');
    await user.type(screen.getByLabelText(/nombre/i), 'New Location');
    await user.type(screen.getByLabelText(/imagen/i), 'https://example.com/image.jpg');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateLocation).toHaveBeenCalledWith({
        code: 'LOC003',
        name: 'New Location',
        image: 'https://example.com/image.jpg',
      });
    });
  });

  it('calls updateLocation when form is submitted for existing location', async () => {
    const user = userEvent.setup();
    const mockUpdateLocation = jest.fn().mockResolvedValue(true);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      updateLocation: mockUpdateLocation,
    });
    
    render(<LocationList />);
    
    // Open edit form
    const editButtons = screen.getAllByLabelText(/editar/i);
    await user.click(editButtons[0]);
    
    // Modify form
    const nameInput = screen.getByLabelText(/nombre/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Location');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /actualizar/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockUpdateLocation).toHaveBeenCalledWith(
        mockLocations[0].id,
        expect.objectContaining({
          name: 'Updated Location',
        })
      );
    });
  });

  it('calls deleteLocation when delete is confirmed', async () => {
    const user = userEvent.setup();
    const mockDeleteLocation = jest.fn().mockResolvedValue(true);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      deleteLocation: mockDeleteLocation,
    });
    
    render(<LocationList />);
    
    // Open delete dialog
    const deleteButtons = screen.getAllByLabelText(/eliminar/i);
    await user.click(deleteButtons[0]);
    
    // Confirm delete
    const confirmButton = screen.getByRole('button', { name: /eliminar/i });
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(mockDeleteLocation).toHaveBeenCalledWith(mockLocations[0].id);
    });
  });

  it('shows total count of locations', () => {
    render(<LocationList />);
    
    expect(screen.getByText(/2 ubicaciones encontradas/i)).toBeInTheDocument();
  });

  it('handles form submission errors gracefully', async () => {
    const user = userEvent.setup();
    const mockCreateLocation = jest.fn().mockResolvedValue(false);
    mockUseLocations.mockReturnValue({
      ...defaultMockReturn,
      createLocation: mockCreateLocation,
    });
    
    render(<LocationList />);
    
    // Open create form
    const addButton = screen.getByLabelText(/agregar ubicación/i);
    await user.click(addButton);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/código/i), 'LOC003');
    await user.type(screen.getByLabelText(/nombre/i), 'New Location');
    await user.type(screen.getByLabelText(/imagen/i), 'https://example.com/image.jpg');
    
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);
    
    // Form should remain open on error
    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });
  });
});