import { useState } from "react";

export default function useSnackBar() {
     const [openSnackBar, setOpenSnackBar] = useState(false);
     const [type, setType] = useState('');
     const [message, setMessage] = useState('');

     function setSnackBar(type, message) {
          setOpenSnackBar(true);
          setType(type);
          setMessage(message);
     }

     return {openSnackBar, type, message, setSnackBar, setOpenSnackBar};
}