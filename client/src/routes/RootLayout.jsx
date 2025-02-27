import { Outlet } from "react-router-dom";
import Header from "../components/adopter-facing/Header";
import Footer from "../components/adopter-facing/Footer";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function RootLayout() {
  const { isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
