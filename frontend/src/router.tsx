import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";
import Layout from "./components/Layout";
import Top from "./pages/Top";
import PublishUrl from "./pages/PublishUrl";
import GroupList from "./pages/groups/GroupList";

export const router = createBrowserRouter([
    {
      path:"*",
      element: (
        <Layout>
          <NotFound />
        </Layout>
      )
    },
    {
      path: "/",
      element: (
        <Layout>
          <Top />
        </Layout>
      )
    },
    {
      path: "/publish-url/:publishId",
      element: (
        <Layout>
          <PublishUrl />
        </Layout>
      )
    },
    {
      path: "/group/:groupId/index",
      element: (
        <Layout>
          <GroupList />
        </Layout>
      )
    },
]);