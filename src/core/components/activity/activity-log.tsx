import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Chip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

type ActivityListProps = {
  activities: any[];
};


export function ActivityLog({
  activities,
}: ActivityListProps) {
  return (
    <List>
      {activities.map((activity: any, index: number) => (
        <Box key={activity.ide_acti}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>
                <Iconify icon="EventNoteIcon" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="textPrimary">
                    {activity.nom_acti}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(activity.fecha_creacion_acti).toLocaleString()}
                  </Typography>
                </Box>
              }
              secondary={
                <>
                  {activity.fecha_completada_acti && (
                    <Chip
                      icon={<Iconify icon="CheckCircleIcon" />}
                      label="Completado"
                      color="success"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {activity.nom_actti} - {activity.nom_actes}
                  </Typography>
                  <Box mt={1}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                    >
                      Historial:
                    </Typography>
                    {activity.historial_acti.map((history: any, i: number) => (
                      <Box key={i} ml={2} mt={1}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          <strong>{history.campo_modificado}:</strong> {history.valor_anterior} ➜ {history.valor_nuevo} (por {history.usuario_actua})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {activity.comentarios && (
                    <Box mt={1}>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                      >
                        Comentarios:
                      </Typography>
                      {activity.comentarios.map((comment: any, j: number) => (
                        <Box key={j} ml={2} mt={1}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            {comment.comentario_actco} - {new Date(comment.fecha_comentario_actco).toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              }
            />
          </ListItem>
          {index < activities.length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  );
};

