// React
import React, { FC, useEffect, useState } from "react";

interface Props {
  children: (copy: (e: any) => void, copied: boolean) => React.ReactElement;
  copyValue: string;
}

// Constant
const COPY_TIMEOUT = 2000;

// Component
const CopyText: FC<Props> = ({ children, copyValue }) => {
  const [copiedTimeout, setCopiedTimeout] = useState<any>(null);

  useEffect(() => {
    return () => {
      clearTimeout(copiedTimeout);
    };
  }, []);

  const copy = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    navigator?.clipboard?.writeText(copyValue);

    clearTimeout(copiedTimeout);
    setCopiedTimeout(
      setTimeout(() => {
        clearTimeout(copiedTimeout);
        setCopiedTimeout(null);
      }, COPY_TIMEOUT)
    );
  };

  return children(copy, copiedTimeout !== null);
};

export default CopyText;
