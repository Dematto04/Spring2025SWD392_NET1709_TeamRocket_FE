import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";

import NotFound from "@/components/NotFound/NotFound";
import ProtectedRoute from "@/components/Authen/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route, i) => {
        const Layout = route.layout;
        return (
          <Route key={i} element={<Layout />}>
            {route.children.map((item) => {
              const Component = item.component;
              return (
                <Route
                  key={item.path}
                  path={item.path}
                  element={
                    <ProtectedRoute isRestricted={route.isRestricted} allowedRoles={item?.allowedRoles}>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              );
            })}
          </Route>
        );
      })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
