import { MantineProvider } from "@mantine/core";
import Layout from "components/Layout";
import Collection from "pages/Collection";
import Dashboard from "pages/Dashboard";
import { Folder } from "pages/Folder";
import Terms from "pages/Terms";
import { shallowEqual, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { path: "/", Component: Dashboard },
      { path: "collection/:id/", Component: Collection },
      { path: "folder/:id/", Component: Folder },
      { path: "terms", Component: Terms },
    ],
  },
]);

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
      <RouterProvider router={router} />;
    </MantineProvider>
  );
}
