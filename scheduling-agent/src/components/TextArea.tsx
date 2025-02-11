import * as React from "react";
import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface TextAreaProps {
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
}

export default function TextArea({ value, setValue, placeholder }: TextAreaProps) {
  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        value={value}
        onChange={handleChange}
        id="standard-multiline-flexible"
        label={placeholder}
        multiline
        maxRows={4}
        variant="standard"
      />
    </Box>
  );
}
