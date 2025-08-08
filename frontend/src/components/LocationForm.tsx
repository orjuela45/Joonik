import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSchema, type LocationFormData } from '../schemas/locationSchema';
import type { Location } from '../types/location';

interface LocationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => Promise<boolean>;
  location?: Location | null;
  loading?: boolean;
  error?: string | null;
}

const LocationForm: React.FC<LocationFormProps> = ({
  open,
  onClose,
  onSubmit,
  location,
  loading = false,
  error = null,
}) => {
  const isEditing = Boolean(location);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      code: '',
      name: '',
      image: '',
    },
    mode: 'onChange',
  });

  const imageUrl = watch('image');

  // Reset form when dialog opens/closes or location changes
  useEffect(() => {
    if (open) {
      if (location) {
        reset({
          code: location.code,
          name: location.name,
          image: location.image,
        });
      } else {
        reset({
          code: '',
          name: '',
          image: '',
        });
      }
    }
  }, [open, location, reset]);

  const handleFormSubmit = async (data: LocationFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isImageValid = (url: string) => {
    try {
      new URL(url);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    } catch {
      return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        {isEditing ? 'Editar Sede' : 'Crear Nueva Sede'}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Código de la Sede"
                  placeholder="Ej: SEDE_01"
                  error={!!errors.code}
                  helperText={errors.code?.message || 'Código único para identificar la sede'}
                  fullWidth
                  disabled={loading}
                  InputProps={{
                    style: { textTransform: 'uppercase' },
                  }}
                  onChange={e => field.onChange(e.target.value.toUpperCase())}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de la Sede"
                  placeholder="Ej: Sede Principal"
                  error={!!errors.name}
                  helperText={errors.name?.message || 'Nombre descriptivo de la sede'}
                  fullWidth
                  disabled={loading}
                />
              )}
            />

            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="URL de la Imagen"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  error={!!errors.image}
                  helperText={errors.image?.message || 'URL de la imagen que representa la sede'}
                  fullWidth
                  disabled={loading}
                  multiline
                  rows={2}
                />
              )}
            />

            {/* Image Preview */}
            {imageUrl && isImageValid(imageUrl) && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Vista previa"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading} variant="outlined">
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isValid}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LocationForm;
