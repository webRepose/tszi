import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Preloader from "./shared/Preloader";

const MainLayout = lazy(() => import("./layout"));

const Home = lazy(() => import("./pages/Home"));
const SmartAnalyzer = lazy(() => import("./pages/SmartAnalyzer"));
const Selection = lazy(() => import("./pages/Selection"));
const Tools = lazy(() => import("./pages/Tools"));
const ToolsDetails = lazy(() => import("./pages/ToolsDetails"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AnalyzerPage = lazy(() => import("./pages/AnalyzerPage"));
const ExpertAnalyzer = lazy(() => import("./pages/ExpertAnalyzer"));

const AppRouter = () => {
  return (
    <Suspense fallback={<Preloader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="requirements" element={<SmartAnalyzer />} />
            <Route path="expert" element={<ExpertAnalyzer />} />
            <Route path="selection" element={<Selection />} />
            <Route path="analyzer" element={<AnalyzerPage />} />
            <Route path="tools" element={<Tools />} />
            <Route path="tools/:id" element={<ToolsDetails />} />
            <Route path="/admin" element={<Admin />} />
          </Route> 

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Suspense>
  );
};

export default AppRouter;


