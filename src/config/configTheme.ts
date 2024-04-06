import { createTheme } from "@mui/material";
import { bgMainColor } from "../styles/variables";


const theme = createTheme({
    typography: {
      fontFamily: [
        'Roboto', 
        'Arial', // Puedes agregar otras fuentes de respaldo aquí
        'sans-serif',
      ].join(','),
    },
    palette: {
      background: {
        default: bgMainColor, // Color de fondo personalizado
      },
    },
});

export default theme;