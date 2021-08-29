import { useState, useEffect } from "react";

export default function usePreviewImage(fileObj, initialValue) {
  const [src, setSrc] = useState(initialValue);

  useEffect(() => {
    if (!fileObj) return;

    const urlSrc =
      typeof fileObj === "string" ? fileObj : URL.createObjectURL(fileObj);
    setSrc(urlSrc);

    return () => URL.revokeObjectURL(urlSrc);
  }, [fileObj]);

  return src;
}
