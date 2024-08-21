import Timeline from '@mui/lab/Timeline';
import { Box, Paper } from '@mui/material';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { fDateTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

type ActivityListProps = {
  activities: any[];
};


export function ActivityLog({
  activities,
}: ActivityListProps) {
  return (
    <Timeline position="right">
      {activities.map((activity: any, index: number) => (


        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            variant="body2"
            color="text.secondary"
          >
            {fDateTime(activity.fecha_creacion_acti)}
            <Typography variant="body2" sx={{ color: 'text.primary' }}>{activity.usuario_ingre}</Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary"/>
            <TimelineConnector />
          </TimelineSeparator>



          <TimelineContent>
            <Paper
              sx={{
                width: "auto",
                p: 3,
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
              }}
            >
              <Typography variant="body2">{activity.nom_acti}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {activity.historial_acti.map((history: any, i: number) => (
                  <Box key={i} ml={2} mt={1}>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      <strong>{history.campo_modificado}:</strong>{' '}
                      {typeof history.valor_anterior === 'object' ? JSON.stringify(history.valor_anterior) : history.valor_anterior} ➜
                      {typeof history.valor_nuevo === 'object' ? JSON.stringify(history.valor_nuevo) : history.valor_nuevo}
                    </Typography>
                  </Box>
                ))}
              </Typography>

            </Paper>
          </TimelineContent>

        </TimelineItem>



      ))
      }

    </Timeline >
  );
};


