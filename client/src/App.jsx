import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./routes/RootLayout";
import AuthLayout from "./routes/AuthLayout";
import PrivateRoute from "./components/shared/PrivateRoute";
import { useDispatch } from "react-redux";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import AdminPanel from "./pages/admin/AdminPanel";
import { useEffect, useState } from "react";
import { checkAuthStatus } from "./features/auth/authSlice";
import Pets from "./pages/adopter/FindPets";
import Shelters from "./pages/adopter/FindShelters";
import HowTo from "./pages/adopter/HowTo";
import Posts from "./pages/adopter/Posts";
import AboutUs from "./pages/adopter/AboutUs";
import Legal from "./pages/adopter/Legal";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import ShelterPanel from "./pages/shelter/ShelterPanel";
import PetDetails from "./components/adopter-facing/PetDetails";
import ShelterDetails from "./components/adopter-facing/ShelterDetails";
import AdoptionApplicationPage from "./components/adopter-facing/AdoptionApplicationPage";
import AddPost from "./components/adopter-facing/AddPost";
import PostDetail from "./components/adopter-facing/PostDetail";
import EditPost from "./components/adopter-facing/EditPost";

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
        path: "post/:id",
        element: (
          <PrivateRoute>
            <PostDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "add-post",
        element: (
          <PrivateRoute>
            <AddPost />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-post/:id",
        element: (
          <PrivateRoute>
            <EditPost />
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
      {
        path: "/adopt/:petId",
        element: (
          <PrivateRoute>
            <AdoptionApplicationPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/shelters/:id",
        element: (
          <PrivateRoute>
            <ShelterDetails />
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
