import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (!session_id) { window.location.href = "/pricing"; return; }

    api.post("/payment/verify", { session_id })
      .then((res) => {
        if (res.data.success) {
          setStatus("success");
          setTimeout(() => { window.location.href = "/pricing"; }, 3000);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
      <div className="bg-[#161824] border border-[#1e2130] rounded-[20px] px-10 py-12 text-center max-w-[420px] w-[90%]">

        {status === "verifying" && (
          <>
            <div className="w-11 h-11 border-[3px] border-[#1e2130] border-t-violet-600 rounded-full mx-auto mb-5 animate-spin" />
            <p className="text-gray-400 text-sm">Verifying your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-[56px] mb-4">🎉</div>
            <h2 className="text-white text-2xl font-extrabold m-0 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-500 text-sm m-0 mb-4 leading-relaxed">
              You are now a Pro member. All courses are unlocked!
            </p>
            <p className="text-gray-600 text-xs mb-4">
              Redirecting to courses in 3 seconds...
            </p>
            <button
              onClick={() => { window.location.href = "/courses"; }}
              className="bg-violet-600 text-white border-none rounded-[10px] px-7 py-3 text-sm font-bold cursor-pointer"
            >
              Go to Courses →
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="text-[56px] mb-4">❌</div>
            <h2 className="text-white text-2xl font-extrabold m-0 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-500 text-sm m-0 mb-4 leading-relaxed">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={() => { window.location.href = "/pricing"; }}
              className="bg-violet-600 text-white border-none rounded-[10px] px-7 py-3 text-sm font-bold cursor-pointer"
            >
              Back to Pricing
            </button>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PaymentSuccess;