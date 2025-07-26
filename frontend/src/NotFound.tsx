import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = ({ Title = "Page" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1); // Navigate to the last page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! {Title} not found</p>
        <button
          onClick={handleGoBack}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Return to Previous Page
        </button>
      </div>
    </div>
  );
};

export default NotFound;
