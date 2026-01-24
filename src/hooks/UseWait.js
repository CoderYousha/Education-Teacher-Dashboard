import { useState } from "react";

export function useWaits() {
  const [sendWait, setSendWait] = useState(false);
  const [getWait, setGetWait] = useState(true);
  const [searchWait, setSearchWait] = useState(false);

  return {
    sendWait,
    setSendWait,
    getWait,
    setGetWait,
    searchWait,
    setSearchWait,
  };
}
