import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./routes/RootLayout";
import AuthLayout from "./routes/AuthLayout";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminPanel from "./features/admin/AdminPanel";
import { useEffect, useState } from "react";
import { checkAuthStatus } from "./features/auth/authSlice";
import Pets from "./pages/Pets";
import Shelters from "./pages/Shelter";
import Rehome from "./pages/Rehome";
import HowTo from "./pages/HowTo";
import Posts from "./pages/Posts";
import AboutUs from "./pages/AboutUs";
import Legal from "./pages/Legal";
import LoadingSpinner from "./components/LoadingSpinner";
import ShelterPanel from "./pages/ShelterPanel";
import PetDetails from "./pages/PetDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "pets",
        element: (
          <PrivateRoute>
            <Pets />
          </PrivateRoute>
        ),
      },
      {
        path: "shelters",
        element: (
          <PrivateRoute>
            <Shelters />
          </PrivateRoute>
        ),
      },
      {
        path: "rehome",
        element: (
          <PrivateRoute>
            <Rehome />
          </PrivateRoute>
        ),
      },
      {
        path: "guide",
        element: (
          <PrivateRoute>
            <HowTo />
          </PrivateRoute>
        ),
      },
      {
        path: "posts",
        element: (
          <PrivateRoute>
            <Posts />
          </PrivateRoute>
        ),
      },
      {
        path: "about-us",
        element: (
          <PrivateRoute>
            <AboutUs />
          </PrivateRoute>
        ),
      },
      {
        path: "legal",
        element: (
          <PrivateRoute>
            <Legal />
          </PrivateRoute>
        ),
      },
      {
        path: "/pet/:id",
        element: (
          <PrivateRoute>
            <PetDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "admin/*",
        element: (
          <PrivateRoute adminOnly>
            <AdminPanel />
          </PrivateRoute>
        ),
      },
      {
        path: "shelter-panel/*",
        element: (
          <PrivateRoute allowedRoles={"shelter"}>
            <ShelterPanel />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Wait for auth check to complete before rendering routes
    const checkAuth = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
        console.log("Auth check failed:", error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Show loading until auth check completes
  if (!isAuthChecked) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
