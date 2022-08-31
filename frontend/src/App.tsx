// React
import React from "react";

// Router
import { Route, Routes } from "react-router-dom";

// MUI
import { Box } from "@mui/material";

// Routes
import NotFound404 from "./pages/NotFound404/NotFound404";
import { routes } from "./routes";

// Components
import DrawerLayout from "./components/Drawer/DrawerLayout";
import AuthenticatedLayout from "./layout/AuthenticatedLayout";
import RegistrationDialog from "./components/Dialog/RegistrationDialog";

const App = () => {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: (theme) => theme.palette.secondary.main,
        minHeight: "100vh",
      }}
    >
      <DrawerLayout>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.hideIfUnregistered ? (
                  <AuthenticatedLayout>
                    <route.component />
                  </AuthenticatedLayout>
                ) : (
                  <route.component />
                )
              }
            />
          ))}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </DrawerLayout>

      <RegistrationDialog />
    </Box>
  );
};

export default App;
