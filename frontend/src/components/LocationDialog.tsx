import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Location } from '../types';

const locationSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(50, 'El código no puede exceder 50 caracteres'),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  image: z
    .string()
    .max(500, 'La URL de imagen no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LocationFormData) => void;
  location?: Location | null;
  loading?: boolean;
}

const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onClose,
  onSave,
  location,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      code: location?.code || '',
      name: location?.name || '',
      image: location?.image || '',
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (open) {
      reset({
        code: location?.code || '',
        name: location?.name || '',
        image: location?.image || '',
      });
    }
  }, [open, location, reset]);

  const onSubmit = (data: LocationFormData) => {
    // Convert empty string to undefined for optional image field
    const submitData = {
      ...data,
      image: data.image === '' ? undefined : data.image,
    };
    onSave(submitData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{location ? 'Editar Ubicación' : 'Nueva Ubicación'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Código"
                  fullWidth
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  disabled={loading}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
                  label="URL de Imagen (opcional)"
                  fullWidth
                  error={!!errors.image}
                  helperText={errors.image?.message || 'URL de la imagen para mostrar'}
                  disabled={loading}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LocationDialog;
