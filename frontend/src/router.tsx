import { createBrowserRouter } from 'react-router-dom';
import Top from './pages/Top';
import GroupList from './pages/groups/GroupList';
import GroupNew from './pages/groups/GroupNew';
import GroupShow from './pages/groups/GroupShow';
import GroupEdit from './pages/groups/GroupEdit';
import PublishUrl from './pages/PublishUrl';
import NotFound from './NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Top />,
  },
  {
    path: '/group/:uuid',
    element: <GroupList />,
  },
  {
    path: '/group/:uuid/new',
    element: <GroupNew />,
  },
  {
    path: '/group/:uuid/show/:paymentId',
    element: <GroupShow />,
  },
  {
    path: '/group/:uuid/edit/:paymentId',
    element: <GroupEdit />,
  },
  {
    path: '/publish/:publishId',
    element: <PublishUrl />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);