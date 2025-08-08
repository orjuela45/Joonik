import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useLocations } from '../hooks/useLocations';
import LocationDialog from '../components/LocationDialog';
import type { Location } from '../types';
import type { LocationFormData } from '../types/location';

const LocationsPage: React.FC = () => {
  const { locations, loading, error, createLocation, updateLocation, deleteLocation } =
    useLocations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleOpenDialog = (location?: Location) => {
    setEditingLocation(location || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLocation(null);
  };

  const handleSaveLocation = async (locationData: LocationFormData) => {
    if (editingLocation) {
      await updateLocation(editingLocation.id, locationData);
    } else {
      await createLocation(locationData);
    }
    handleCloseDialog();
  };

  const handleDeleteLocation = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      await deleteLocation(id);
    }
  };

  if (loading && locations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Ubicaciones
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Nueva Ubicación
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {locations.length === 0 && !loading ? (
        <Alert severity="info">No hay ubicaciones registradas. ¡Crea la primera!</Alert>
      ) : (
        <Grid container spacing={3}>
          {locations.map(location => (
            <Grid item xs={12} sm={6} md={4} key={location.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" component="h2">
                      {location.name}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    Código: {location.code}
                  </Typography>
                  {location.image && (
                    <Typography variant="body2" color="text.secondary">
                      Imagen: {location.image}
                    </Typography>
                  )}
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Creado: {new Date(location.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(location)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteLocation(location.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      <LocationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveLocation}
        location={editingLocation}
        loading={loading}
      />
    </Box>
  );
};

export default LocationsPage;
