import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
      return;
    }

    if (error) {
      navigate("/login?error=" + error, { replace: true });
      return;
    }

    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login?error=unknown", { replace: true });
    }
  }, [token, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        
        {/* Spinner */}
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-purple-500"></div>

        {/* Text */}
        <p className="text-sm text-gray-400">
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;