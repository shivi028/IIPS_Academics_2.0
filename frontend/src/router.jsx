import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import SubjectDetail from "./components/academics/SubjectDetail/SubjectDetail";
import Subject from "./components/academics/Subject/Subject";
import App from "./App";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Home from "./components/Home/Home";
import SignUp from "./components/SIgnUp/SignUp.jsx";
import StudentContributions from "./components/StudentContributions/StudentContributions.jsx";
import ContactPage from "./components/contact/ContactPage.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import Placement from "./components/Placement/Placement";
import AdminRoute from "./components/PrivateRoute/AdminRoute.jsx";
import NotFound from "./components/Error/NotFound.jsx";
import RequestPasswordReset from "./components/Auth/RequestPasswordReset.jsx";
import UpdatePassword from "./components/Auth/UpdatePassword.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "request-password-reset", element: <RequestPasswordReset /> },
      { path: "update-password", element: <UpdatePassword /> },
      { path: "academics", element: <Subject /> },
      { path: "subject/:id", element: <SubjectDetail /> },
      { path: "Contributors", element: <StudentContributions /> },
      { path: "Contact", element: <ContactPage /> },
      { path: "placements", element: <Placement /> },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
]);

export default router;
