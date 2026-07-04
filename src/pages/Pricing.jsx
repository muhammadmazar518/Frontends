import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const plans = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      color: "#38bdf8",
      icon: "🆓",
      desc: "Perfect for individuals getting started.",
      highlight: false,
      features: [
        { text: "1 User", included: true },
        { text: "Basic Dashboard", included: true },
        { text: "5GB Storage", included: true },
        { text: "Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: false },
        { text: "Pro Courses", included: false },
        { text: "Priority Support", included: false },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Get Started Free",
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      color: "#7c3aed",
      icon: "⚡",
      desc: "For growing teams and professionals.",
      highlight: true,
      features: [
        { text: "10 Users", included: true },
        { text: "Advanced Dashboard", included: true },
        { text: "50GB Storage", included: true },
        { text: "Priority Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Buy Professional Plan",
    },
    {
      name: "Business",
      price: "$49",
      period: "/month",
      color: "#f59e0b",
      icon: "🏢",
      desc: "For large teams and enterprises.",
      highlight: false,
      features: [
        { text: "Unlimited Users", included: true },
        { text: "Custom Analytics", included: true },
        { text: "500GB Storage", included: true },
        { text: "24/7 Phone Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Dedicated Manager", included: true },
      ],
      cta: "Buy Business Plan",
    },
  ],
  yearly: [
    {
      name: "Free",
      price: "$0",
      period: "/year",
      color: "#38bdf8",
      icon: "🆓",
      desc: "Perfect for individuals getting started.",
      highlight: false,
      features: [
        { text: "1 User", included: true },
        { text: "Basic Dashboard", included: true },
        { text: "5GB Storage", included: true },
        { text: "Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: false },
        { text: "Pro Courses", included: false },
        { text: "Priority Support", included: false },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Get Started Free",
    },
    {
      name: "Professional",
      price: "$99",
      period: "/year",
      color: "#7c3aed",
      icon: "⚡",
      desc: "For growing teams and professionals.",
      highlight: true,
      badge: "Save 57%",
      features: [
        { text: "10 Users", included: true },
        { text: "Advanced Dashboard", included: true },
        { text: "50GB Storage", included: true },
        { text: "Priority Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Buy Professional Plan",
    },
    {
      name: "Business",
      price: "$249",
      period: "/year",
      color: "#f59e0b",
      icon: "🏢",
      desc: "For large teams and enterprises.",
      highlight: false,
      badge: "Save 58%",
      features: [
        { text: "Unlimited Users", included: true },
        { text: "Custom Analytics", included: true },
        { text: "500GB Storage", included: true },
        { text: "24/7 Phone Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Dedicated Manager", included: true },
      ],
      cta: "Buy Business Plan",
    },
  ],
};

const Pricing = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [userPlan, setUserPlan] = useState("Free");
  const [userBilling, setUserBilling] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("PROFILE API RESPONSE:", data);

        if (data.plan_name && data.plan_name !== "Free") {
          const isYearly = data.plan_name.includes("(yearly)");
          const cleanPlan = data.plan_name
            .replace(" (monthly)", "")
            .replace(" (yearly)", "");
          setUserPlan(cleanPlan);
          setUserBilling(isYearly ? "yearly" : "monthly");
          setBilling(isYearly ? "yearly" : "monthly");
        } else {
          setUserPlan("Free");
          setUserBilling(null);
        }
      });
  }, []);
  const currentPlans = plans[billing];

  const handleCheckout = async (plan) => {
    if (plan.price === "$0") {
      navigate("/dashboard");
      return;
    }
    localStorage.setItem("userPlan", plan.name);

    const numericAmount = parseInt(plan.price.replace("$", ""), 10);
    const planIdentifier = `${plan.name} (${billing})`;
    setLoadingPlan(plan.name);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            planName: planIdentifier,
            amount: numericAmount,
            billingPeriod: billing,
          }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment initialization failed.");
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error("Stripe Redirect Error:", error);
      alert("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <div>
      <h1 className="text-white text-[30px] font-extrabold m-0 mb-1 tracking-tight">
        Pricing Plans
      </h1>
      <p className="text-gray-400 text-sm mb-7">
        Choose the plan that works best for you and your team.
      </p>

      {/* Billing Toggle */}
      <div className="flex bg-[#161824] border border-[#1e2130] rounded-xl p-1 w-fit mb-9 gap-1">
        {["monthly", "yearly"].map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg border-none text-sm font-semibold cursor-pointer transition-all duration-200"
            style={{
              background: billing === b ? "#7c3aed" : "transparent",
              color: billing === b ? "#fff" : "#6b7280",
            }}
          >
            {b.charAt(0).toUpperCase() + b.slice(1)}
            {b === "yearly" && (
              <span className="bg-[#052e16] text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-[20px]">
                Save up to 58%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-10 items-start">
        {currentPlans.map((plan) => {
          const isCurrent = userPlan === plan.name && userBilling === billing;

          return (
            <div
              key={plan.name}
              className="bg-[#161824] rounded-[20px] p-7 relative flex flex-col gap-4 transition-transform duration-200"
              style={{
                border: plan.highlight
                  ? `2px solid ${plan.color}`
                  : "1px solid #1e2130",
                transform: plan.highlight ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* Most Popular Badge */}
              {plan.highlight && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold px-4 py-1 rounded-[20px] whitespace-nowrap"
                  style={{ background: plan.color }}
                >
                  Most Popular
                </div>
              )}

              {/* Save Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-[#052e16] text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-[20px] border border-green-800">
                  {plan.badge}
                </div>
              )}

              {/* Card Header */}
              <div className="flex items-start gap-3">
                <span className="text-[28px] shrink-0">{plan.icon}</span>
                <div>
                  <h3 className="text-white text-lg font-bold m-0 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-xs m-0 leading-snug">
                    {plan.desc}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[40px] font-extrabold tracking-tight"
                  style={{ color: plan.color }}
                >
                  {plan.price}
                </span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>

              <div className="h-px bg-[#1e2130]" />

              {/* Features */}
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-2.5">
                    <span
                      className="text-[13px] font-bold w-4 shrink-0"
                      style={{ color: f.included ? "#34d399" : "#374151" }}
                    >
                      {f.included ? "✓" : "✕"}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: f.included ? "#d1d5db" : "#4b5563" }}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan !== null || isCurrent}
                className="w-full py-3.5 rounded-[10px] text-sm font-bold text-white cursor-pointer mt-2 transition-all duration-200"
                style={{
                  background: isCurrent
                    ? "#22c55e"
                    : plan.highlight
                      ? plan.color
                      : "transparent",
                  border: isCurrent
                    ? "1px solid #22c55e"
                    : `1px solid ${plan.color}`,
                  opacity: loadingPlan && loadingPlan !== plan.name ? 0.5 : 1,
                  cursor: isCurrent ? "default" : "pointer",
                }}
              >
                {loadingPlan === plan.name
                  ? "Connecting..."
                  : isCurrent
                    ? "✓ Current Plan"
                    : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-4">
        <h2 className="text-white text-xl font-bold mb-5">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {[
            { q: "Can I upgrade anytime?", a: "Yes, you can upgrade or downgrade your plan at any time." },
            { q: "Is there a free trial?", a: "Professional plan comes with a 14-day free trial, no credit card required." },
            { q: "What payment methods?", a: "We accept all major credit cards, PayPal, and bank transfers." },
            { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no penalties." },
          ].map((item) => (
            <div
              key={item.q}
              className="bg-[#161824] border border-[#1e2130] rounded-xl p-5"
            >
              <h4 className="text-white text-sm font-semibold m-0 mb-2">
                {item.q}
              </h4>
              <p className="text-gray-500 text-[13px] m-0 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;