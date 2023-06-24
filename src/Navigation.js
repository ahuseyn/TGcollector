import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Collection from "./pages/Collection";
import Dashboard from "./pages/Dashboard";
import { useSelector, shallowEqual } from "react-redux";

export default function Navigation() {
  const theme = useSelector((state) => state.theme, shallowEqual);

  return (
    <MantineProvider
      theme={{
        colorScheme: theme,
        defaultRadius: "md",
        primaryColor: "indigo",
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="collection/:id/" element={<Collection />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
