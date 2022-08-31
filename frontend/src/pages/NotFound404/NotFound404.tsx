// React
import React, { useEffect, useRef } from "react";

// Routing
import { Navigate } from "react-router-dom";

// React Toast
import { toast } from "react-toastify";

const NotFound404 = () => {
const isMounted = useRef(false);

  useEffect(() => {
    if(!isMounted.current)  isMounted.current = true;
    else return;

    toast.error(<>404 - Page not found<br/>Redirected to Home</>, { autoClose: 5000 });
  }, []);

  return <Navigate to="/" replace={true} />;
};

export default NotFound404;
