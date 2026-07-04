
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("❌ Token nahi mila."); return; }

    axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setStatus("✅ Email verify ho gaya! Dashboard par ja rahe hain...");
        setTimeout(() => navigate("/dashboard"), 2000);
      })
      .catch((err) => {
        setStatus("❌ " + (err.response?.data?.message || "Verification fail."));
      });
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h2>{status}</h2>
    </div>
  );
}