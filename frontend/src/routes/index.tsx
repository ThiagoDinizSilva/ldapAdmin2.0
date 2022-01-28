import React from "react";
import { useAuth } from "../context/auth";

import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const Routes: React.FC = () => {
  const { signed } = useAuth();
  return signed ? <PrivateRoutes /> : <PublicRoutes />;
}

export default Routes;
