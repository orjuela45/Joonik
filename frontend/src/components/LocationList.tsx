import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Pagination,
  Paper,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useLocations } from '../hooks/useLocations';
import type { LocationFilters, Location, LocationFormData } from '../types/location';
import LocationCard from './LocationCard';
import LocationForm from './LocationForm';

const LocationList: React.FC = () => {
  const [filters, setFilters] = useState<LocationFilters>({
    page: 1,
    per_page: 12,
  });
  const [searchValues, setSearchValues] = useState({
    name: '',
    code: '',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  const {
    locations,
    loading,
    error,
    meta,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    clearError,
  } = useLocations(filters);

  // Debounced search
  const handleSearch = useCallback(() => {
    const newFilters = {
      ...filters,
      page: 1,
      name: searchValues.name.trim() || undefined,
      code: searchValues.code.trim() || undefined,
    };
    setFilters(newFilters);
    fetchLocations(newFilters);
  }, [filters, searchValues, fetchLocations]);

  const handleClearFilters = () => {
    setSearchValues({ name: '', code: '' });
    const newFilters = { page: 1, per_page: 12 };
    setFilters(newFilters);
    fetchLocations(newFilters);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchLocations(newFilters);
  };

  const handleCreateLocation = () => {
    setEditingLocation(null);
    setFormOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setLocationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (locationToDelete) {
      const success = await deleteLocation(locationToDelete);
      if (success) {
        setDeleteDialogOpen(false);
        setLocationToDelete(null);
        // Refresh the list
        fetchLocations(filters);
      }
    }
  };

  const handleFormSubmit = async (data: LocationFormData) => {
    let success = false;

    if (editingLocation) {
      success = await updateLocation(editingLocation.id, data);
    } else {
      success = await createLocation(data);
    }

    if (success) {
      // Refresh the list
      fetchLocations(filters);
    }

    return success;
  };

  const hasActiveFilters = useMemo(() => {
    return searchValues.name.trim() || searchValues.code.trim();
  }, [searchValues]);

  const isEmpty = !loading && locations.length === 0;
  const isEmptyWithFilters = isEmpty && hasActiveFilters;
  const isEmptyWithoutFilters = isEmpty && !hasActiveFilters;

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      p: { xs: 2, sm: 3 },
      margin: 0
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Gestión de Sedes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra las sedes de tu organización
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Filtros de Búsqueda
          </Typography>
          {hasActiveFilters && (
            <Chip label="Filtros activos" size="small" color="primary" variant="outlined" />
          )}
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Buscar por nombre"
              placeholder="Nombre de la sede"
              value={searchValues.name}
              onChange={e => setSearchValues(prev => ({ ...prev, name: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Buscar por código"
              placeholder="Código de la sede"
              value={searchValues.code}
              onChange={e =>
                setSearchValues(prev => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
                style: { textTransform: 'uppercase' },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ flexGrow: 1 }}
              >
                Buscar
              </Button>

              {hasActiveFilters && (
                <Button variant="outlined" onClick={handleClearFilters} startIcon={<ClearIcon />}>
                  Limpiar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Empty State - No Results with Filters */}
      {isEmptyWithFilters && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No se encontraron sedes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            No hay sedes que coincidan con los filtros aplicados. Intenta modificar los criterios de
            búsqueda.
          </Typography>
          <Button variant="outlined" onClick={handleClearFilters}>
            Limpiar filtros
          </Button>
        </Paper>
      )}

      {/* Empty State - No Data */}
      {isEmptyWithoutFilters && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <LocationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No hay sedes registradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comienza creando tu primera sede para gestionar las ubicaciones de tu organización.
          </Typography>
          <Button variant="contained" onClick={handleCreateLocation} startIcon={<AddIcon />}>
            Crear primera sede
          </Button>
        </Paper>
      )}

      {/* Locations Grid */}
      {!loading && locations.length > 0 && (
        <>
          <Grid container spacing={3}>
            {locations.map(location => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={location.id}>
                <LocationCard
                  location={location}
                  onEdit={handleEditLocation}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={meta.total_pages}
                page={meta.current_page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Results Info */}
          {meta && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {locations.length} de {meta.total} sedes
                {meta.total_pages > 1 && ` (Página ${meta.current_page} de ${meta.total_pages})`}
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="Crear sede"
        onClick={handleCreateLocation}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Location Form Dialog */}
      <LocationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        location={editingLocation}
        loading={loading}
        error={error}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta sede? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocationList;
