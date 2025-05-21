import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";
import Layout from "./components/layouts/Layout";
import GroupLayout from "./components/layouts/GroupLayout";
import Top from "./pages/Top";
import PublishUrl from "./pages/PublishUrl";
import GroupList from "./pages/groups/GroupList";
import GroupNew from "./pages/groups/GroupNew";
import GroupShow from "./pages/groups/GroupShow";
import GroupEdit from "./pages/groups/GroupEdit";

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
      path: "/group/:groupId",
      element: (
        <Layout>
          <GroupLayout>
            <GroupList />
          </GroupLayout>
        </Layout>
      )
    },
    {
      path: "/group/:groupId/new",
      element: (
        <Layout>
          <GroupLayout>
            <GroupNew />
          </GroupLayout>
        </Layout>
      )
    },
    {
      path: "/group/:groupId/show/:paymentId",
      element: (
        <Layout>
          <GroupLayout>
            <GroupShow />
          </GroupLayout>
        </Layout>
      )
    },
    {
      path: "/group/:groupId/edit/:paymentId",
      element: (
        <Layout>
          <GroupLayout>
            <GroupEdit />
          </GroupLayout>
        </Layout>
      )
    }
]);