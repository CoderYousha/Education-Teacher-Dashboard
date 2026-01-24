import { useState } from "react";

export function useDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function setDialog(title, description) {
    setTitle(title);
    setDescription(description);
    setOpen(true);
  }

  return { open, title, description, setDialog, setOpen };
}