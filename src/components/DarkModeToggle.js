import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function DarkModeToggle({ toggleColorMode }) {
     const theme = useTheme();

     return (
          <IconButton
               onClick={toggleColorMode}
               sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: "12px",
                    padding: "8px",
                    boxShadow: 2,
                    transition: "0.3s",
                       position: 'absolute',
                       right: 16,
                       top: 12,
                    zIndex: 9999,
                    "&:hover": {
                         boxShadow: 4,
                         transform: "scale(1.05)",
                    },
               }}
          >
               {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
     );
}
