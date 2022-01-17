import React from "react";
import { useAuth } from "../context/auth";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

function Routes() {
  const { signed } = useAuth();
  return signed ? <PrivateRoutes /> : <PublicRoutes />;
}

export default Routes;
