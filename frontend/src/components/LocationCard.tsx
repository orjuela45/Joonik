import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import type { Location } from '../types/location';

interface LocationCardProps {
  location: Location;
  onEdit?: (location: Location) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme => theme.shadows[8],
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={location.image}
        alt={location.name}
        onError={handleImageError}
        sx={{
          objectFit: 'cover',
        }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              flexGrow: 1,
              mr: 1,
            }}
          >
            {location.name}
          </Typography>

          {showActions && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {onEdit && (
                <Tooltip title="Editar sede">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(location)}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip title="Eliminar sede">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(location.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <Chip
            label={location.code}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
            }}
          />
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Creado: {formatDate(location.created_at)}
          </Typography>

          {location.updated_at !== location.created_at && (
            <Typography variant="caption" color="text.secondary" display="block">
              Actualizado: {formatDate(location.updated_at)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
