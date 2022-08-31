// React
import React from "react";

// Types
import type { SvgIconComponent } from "@mui/icons-material";

export interface Route {
  name: string;
  path: string;
  icon?: SvgIconComponent;
  hideInDrawer?: boolean;
  hideIfUnregistered?: boolean;
  component: React.FC<any>;
}
