

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


type PDFViewProps = {
  url: string;
  title: string;
  open: boolean;
  onClose: () => void;
};


export default function PDFView({ url, open, onClose, title = "Vista Previa del PDF" }: PDFViewProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div style={{ height: '80vh' }}>
          <iframe
            title="Vista Previa del PDF"
            src={url}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
