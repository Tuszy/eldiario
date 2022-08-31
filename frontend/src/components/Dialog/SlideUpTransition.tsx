// React
import React from "react";

// MUI
import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

// Component
const SlideUpTransition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} appear={false} />
);

export default SlideUpTransition;
