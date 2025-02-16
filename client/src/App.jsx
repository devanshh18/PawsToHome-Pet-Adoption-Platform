/*import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "./features/auth/authSlice";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./features/admin/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import Pets from "./pages/Pets";
import AddPost from "./pages/AddPost";
import Shelters from "./pages/Shelter";
import Rehome from "./pages/Rehome";
import HowTo from "./pages/HowTo";
import Posts from "./pages/Posts";
import AboutUs from "./pages/AboutUs";
import Legal from "./pages/Legal";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);


  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <ToastContainer />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/guide" element={<HowTo />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/pets"
              element={
                <PrivateRoute>
                  <Pets />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-post"
              element={
                <PrivateRoute>
                  <AddPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/shelters"
              element={
                <PrivateRoute>
                  <Shelters />
                </PrivateRoute>
              }
            />
            <Route
              path="/rehome"
              element={
                <PrivateRoute>
                  <Rehome />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <PrivateRoute>
                  <Posts />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App; */
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

// ... other imports

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
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
        element: <HowTo />,
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
        element: <AboutUs />,
      },
      {
        path: "legal",
        element: <Legal />,
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
        path: "shelter-panel",
        element: (
          <PrivateRoute>
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
