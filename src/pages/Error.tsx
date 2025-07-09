import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

const Error = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong.</p>
      <p className="text-gray-600 mb-6">
        {error?.statusText || error?.message || "An unexpected error occurred."}
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
