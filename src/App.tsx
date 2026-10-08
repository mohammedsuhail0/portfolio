import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));
const Demo = lazy(() => import("./components/ui/demo"));
import { LoadingProvider } from "./context/LoadingProvider";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LoadingProvider>
                <Suspense fallback={null}>
                  <MainContainer />
                </Suspense>
              </LoadingProvider>
            }
          />
          <Route
            path="/demo"
            element={
              <Suspense fallback={<div>Loading Demo...</div>}>
                <Demo />
              </Suspense>
            }
          />
          <Route
            path="/myworks"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <MyWorks />
              </Suspense>
            }
          />
          <Route
            path="/play"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Play />
              </Suspense>
            }
          />
        </Routes>
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
