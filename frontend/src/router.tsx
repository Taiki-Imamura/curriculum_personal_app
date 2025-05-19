import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout"
import Top from "./pages/Top";
import PublishUrl from "./pages/PublishUrl";

export const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <Top />
        </Layout>
      )
    },
    {
      path: "/publish-url",
      element: (
        <Layout>
          <PublishUrl />
        </Layout>
      )
    },
]);