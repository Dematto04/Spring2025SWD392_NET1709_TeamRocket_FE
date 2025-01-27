import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { Suspense } from "react";
import NotFound from "@/components/NotFound/NotFound";

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
                    <Suspense fallback={''}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        );
      })}
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
};

export default AppRoutes;
