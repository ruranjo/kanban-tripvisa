import { createTheme } from "@mui/material";
import { bgMainColor } from "../styles/variables";


const theme = createTheme({
    palette: {
      background: {
        default: bgMainColor, // Color de fondo personalizado
      },
    },
});

export default theme;