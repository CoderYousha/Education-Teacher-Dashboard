import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({names=[], values=[], title, selected=null, onChange}) {
  const [select, setSelect] = React.useState(selected);

  const handleChange = (event) => {
    setSelect(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={select}
          label="Select"
          onChange={(e) => {onChange(e.target.value); setSelect(e.target.value);}}
        >
          {
               names.map((name, index) => 
                    <MenuItem value={values[index]}>{name}</MenuItem>
               )
          }
        </Select>
      </FormControl>
    </Box>
  );
}