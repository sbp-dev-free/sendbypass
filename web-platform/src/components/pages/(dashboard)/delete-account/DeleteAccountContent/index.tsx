"use client";
import { useState } from "react";

import { OriginalContent } from "./OriginalContent";
import { SuccessMessage } from "./SuccessMessage";

export const DeleteAccountContent = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  return (
    <div className="p-16 mt-16 bg-surface-container-lowest rounded-medium">
      {formSubmitted ? (
        <SuccessMessage />
      ) : (
        <OriginalContent setFormSubmitted={setFormSubmitted} />
      )}
    </div>
  );
};
