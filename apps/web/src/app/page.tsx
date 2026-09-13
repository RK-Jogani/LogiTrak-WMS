"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Custom gradient SVG Icons for modern look
const InventoryIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="invGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="url(#invGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShippingIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" fill="url(#shipGrad)" />
    <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h10zm0 0h10v-4a1 1 0 00-.3-.7l-3-3a1 1 0 00-.7-.3H13v8z" stroke="url(#shipGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OrderIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="orderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="url(#orderGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BillingIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="billGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="url(#billGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const integrationLogos = [
  { alt: "Amazon", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHY5qo0S4RfSZqxPxT50Hl9qlsJTP9N0EMeWyzXcsNx7uTw6aPd96GaQ4f173HGDPDuTKq2mMf5YZl4iF-S7cejh_bPHk5YzKJMa4WkW4W0XzeUxV-TE9LP5OllId5n3D_938AJ6cHpWhtCX_OuDxZECLm5vlqp9uCYfyqfIAJycYVr69KUga9hRk_WP8kYswNxEO4p3DOOx6u_C-hfPCEJkQWdf_zGTOed6v2Y-lw0YbgMswRPmupO3SvpQaDo3CFjSFtqd1q1w4i" },
  { alt: "Shopify", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi_GR1uobZQ-BFLzZ7Oq9jmtn_iGvsL_hYq2EqoTv_XzdGTOOrdgDkl3uwDtBXF7hLSNJxtQyBApUtNTDTwQN0gpFickri-5965rOtKenE5oMk-UuLvyQ5l3adsfMqBNn1O-5UM5mOA45MxHcZG7tjLak_AxaFv4k9Hzd2AAbXcqO8JSro-N7jE1W-1j7CDLJsVDzkpkOLb0M40vck1Gte-NrqcrEPjgQpnHLBUY3n-FJivdKuAnXpUPPebfRiYwth1XY_R-xQfTFu" },
  { alt: "WooCommerce", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8KDqkAFQceoFRRBWmzpML_GClyACjLWpfdmqzfQaZZ42fgTIpeWbR3AEBWy2XjEKPbZqndP4OBXvEx-bt2On-U31x25u6bgKqoHxSvmC1LhtV1TUMjeECfmWHennSAqQVnbmKikPnGaItdQ68WbctszKYq5AJPgaAcrUFdCHLjB1I8eGqoylDcOy6ZIp_9fhkv8KuCH60EecjC6_tK5TmrEs6hbeELh1wzBwCNTDIRG6nWvGTyX5uChzC9V33tDANqx7sDGUSel-f" },
  { alt: "UPS", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQaj8NuwXN4ogNuzIaL2XwMCyYEF0i_RVMJFqhSIt76xLHjKKtIrmVW4vOYqHdX72tceWgqaL_jLph1i-IROcS3Of8297euhBAsH1SromnG7ioVkUKmpYmQfQAjEsvgfbj7O5CAqtjNmHATR968LfEF8gxkBSicV-elz8imwJtK0LGlPT2JU2ODJWWhOB2IvpZDifszNIoQvtGzW12wy5UOxP10Rz2FMMYquRwONAJEz8oznCMioRyTg3nTib3_b3AKp7d_mQlqDTG" },
  { alt: "FedEx", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA8T5oR3LruNi7DBODVu2VMoo5qOkWxZ5ZGbaeoEnxoOxEkXs_Mv0E-GV0OjYoerpB_3y7HE5Uf1aK-CI0u89cv0hz8qzwp3B7U4Kqb9HxY6aF86Xo33hJWPxl9R6dRgki-cyFzz-IWxPOD-mmHqnV0eJzyjS8vNmXKajJWn4WYJya1jjgX62gjn6-oDSyJTyNGIeMdnDBjA5d1Y-ker6N5xWPPHazP7tUtvqqMxU4arjzzMIfnrYj7rh4OVVIYahauIgQdmrKmMGT" },
  { alt: "eBay", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxR7AiLcxLzvI0O0M715TfojwT-ChaD_VmSMTvG-imwqPJJkpayrkLmAiY6twpL3qSw18qDuhNRg66LMfXZX-RQ5FUSwu_Rpf6T7V5EDgh0mpyK6XPS_AWl8Z1UE4c_B9RmrkxZ1EoyhSVZe8YafD7_d-t-f7o96iZRrC72jeeJv6tegS5WLQgYtF4NaJ9T6WEJEjwIGNJT2v45XBAGzL-k3IyMFM2UecN3WQDp0C4bvQVaOpmEF-e6E27D2H3Zp_7DiISA7IL6yQh" },
  { alt: "AliExpress", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwbqrd6qYglYO2Bqlr7_icb_d3QqAwI3uGa1FKNsS4m0yWFUWHSDyhQ4c5-RqZ-zZc6_2pmPKOgfHURw1QmpW53sfzBE9H7wgbVuSW-JYmHhXNEjaBPp0D4DO3jspR6e44pab9Fjv2axuUi85UmIYK4iyBT73QRLaCrVc5R9eIbCCE_Bc79dzH_NDySddv7tiRFjBSEZ_5-GeUGYfwpkdc89M3ljOpXRkya5UCkiKI5hTILwueQyLL594BW64zEIQ6M4VIVP4opJ_a" }
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Simulation State Machine
  const [simStep, setSimStep] = useState(0);
  const [simStatus, setSimStatus] = useState("Idle");
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Run routing simulation
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    setSimStatus("Processing");
    setSimLogs(["[10:04:12] 📥 Order #9482 fetched from Shopify API."]);

    const timer1 = setTimeout(() => {
      setSimStep(2);
      setSimLogs(prev => [
        ...prev,
        "[10:04:13] 🔍 Allocation Manager checking Zone B (Bulk Inventory)...",
        "[10:04:13] 🟢 Inventory confirmed: SKU-992A matched & reserved."
      ]);
    }, 1500);

    const timer2 = setTimeout(() => {
      setSimStep(3);
      setSimLogs(prev => [
        ...prev,
        "[10:04:15] 🏷️ Fetching rates from shipping partners...",
        "[10:04:15] 📦 Selected FedEx Express ($14.28). PDF Airbill generated."
      ]);
    }, 3200);

    const timer3 = setTimeout(() => {
      setSimStep(4);
      setSimStatus("Completed");
      setSimLogs(prev => [
        ...prev,
        "[10:04:17] 🚚 Assigned to Outbound Dock 4. Manifest synced.",
        "[10:04:17] 🎉 Order marked as SHIPPED. Customer notification dispatched."
      ]);
      setIsSimulating(false);
    }, 5000);
  };

  const resetSimulation = () => {
    setSimStep(0);
    setSimStatus("Idle");
    setSimLogs([]);
    setIsSimulating(false);
  };

  const faqItems = [
    {
      q: "Does LogiTrack WMS support multi-warehouse operations?",
      a: "Yes. You can manage multiple warehouses, track transfers, and assign specific zone hierarchies (bins, racks, levels) dynamically from the centralized control panel."
    },
    {
      q: "How long does the sync take between marketplaces?",
      a: "Inventory levels and orders are synchronized in real-time. For major marketplaces like Shopify and Amazon, updates reflect within seconds of stock modifications."
    },
    {
      q: "Can I connect my own custom warehouse hardware or scanners?",
      a: "Absolutely. Our app integrates natively with standard handheld barcode scanners, rugged mobile terminals (Zebra/Honeywell), and prints directly to ZPL-based network label printers."
    },
    {
      q: "Is the platform compliant with Spanish invoicing rules (VeriFactu)?",
      a: "Yes, LogiTrack WMS is fully equipped with compliance logging scaffolds and tamper-proof ledger architectures to align with modern European digital billing rules."
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen relative overflow-hidden" style={{ fontFamily: "Rubik, sans-serif" }}>
      
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-violet-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Styles for Infinite Marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .glass-header {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }
        .gradient-border {
          position: relative;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          padding: 1.5px;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-header shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                LogiTrack <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">WMS</span>
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-10">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("simulator")}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Live Demo
              </button>
              <button
                onClick={() => scrollToSection("integrations")}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Integrations
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </nav>

            {/* CTA Button */}
            <div>
              <Link
                href="/login"
                className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="pt-20 pb-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Hero Text */}
              <div className="lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start">
                
                {/* Micro-badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-6 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Next-Gen Warehouse OS v2.0
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
                  The warehouse OS designed for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                    scale.
                  </span>
                </h1>
                
                <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                  Manage inventory, automate carrier routing, and sync sales channels in real-time. Built for brands that demand industrial precision.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 text-center transition-all duration-150"
                  >
                    Start Free 14-Day Trial
                  </Link>
                  <button
                    onClick={() => scrollToSection("simulator")}
                    className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-150"
                  >
                    See How It Works
                  </button>
                </div>

                {/* Highlights */}
                <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80 w-full">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.98%</p>
                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Stock Accuracy</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">45%</p>
                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Faster Picking</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">&lt; 3s</p>
                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Sync Latency</p>
                  </div>
                </div>

              </div>
              
              {/* Hero Mockup (Browser Frame) */}
              <div className="lg:w-1/2 relative w-full">
                <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden transform lg:translate-x-6 hover:scale-[1.01] transition-transform duration-300">
                  
                  {/* Browser Bar */}
                  <div className="bg-slate-950 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
                    </div>
                    <div className="bg-slate-900 text-slate-500 text-[11px] px-8 py-1 rounded mx-auto w-1/2 text-center select-none font-mono">
                      app.logitrack.io/dashboard
                    </div>
                  </div>

                  {/* Dashboard Preview Image */}
                  <div className="p-1 bg-slate-900">
                    <img
                      alt="LogiTrack Dashboard Preview"
                      className="w-full h-auto rounded-b-lg object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-gKTxxTr0FSi80bIk7OdElhS6t8GY1pibUCOJ7CrpX-6Kot_AiZtzUdEkttpVq1h2OOeVrL1ZDk2JtPyiP62cpQqGRF8W_whcyWmODfD3Z8ulUVZ_k1zegMybf4P_QBSOaAIyA5cjrHwuOEyIUenLKPcI25OA59mb4ljXfgoC31EAbBq3bSCu-WLBwYaoyqklNhdRQfYoEa9ZsSUMyfkjHFGItp7YW-n7cQmL7mfUMeSi0N_Z81mq-gOQpX2BKF-p9bfgjJpx6UdI"
                    />
                  </div>

                </div>

                {/* Floating Stats Badge */}
                <div className="absolute -bottom-8 -left-4 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3.5 max-w-[240px] animate-bounce-slow">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shipped Today</p>
                    <p className="text-lg font-extrabold text-slate-800">4,812 units</p>
                  </div>
                </div>

                {/* Background shadow glow */}
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-blue-600/5 -z-10 rounded-xl blur-xl" />
              </div>

            </div>
          </div>
        </section>

        {/* Live Simulator Widget Section */}
        <section id="simulator" className="py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-16">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Experience routing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">real-time.</span>
              </h2>
              <p className="mt-4 text-slate-400 text-lg leading-relaxed">
                Click below to simulate how LogiTrack dynamically processes and routes orders across systems instantly.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              
              {/* Simulation Header */}
              <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">Routing Core Simulator</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={startSimulation}
                    disabled={isSimulating}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded font-mono disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isSimulating ? "Routing..." : "Start Simulation"}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded font-mono transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Simulation Body */}
              <div className="p-8 grid md:grid-cols-12 gap-8">
                
                {/* State Machine */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div className="space-y-6">
                    
                    {/* Step 1 */}
                    <div className={`flex items-start gap-4 transition-all duration-300 ${simStep >= 1 ? "opacity-100" : "opacity-30"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border font-bold text-sm ${
                        simStep > 1 ? "bg-blue-600 border-blue-600 text-white" : simStep === 1 ? "bg-slate-900 border-blue-500 text-blue-400 animate-pulse" : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}>
                        {simStep > 1 ? "✓" : "1"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">Fetch Order Data</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Shopify API webhook triggers instant fetch.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className={`flex items-start gap-4 transition-all duration-300 ${simStep >= 2 ? "opacity-100" : "opacity-30"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border font-bold text-sm ${
                        simStep > 2 ? "bg-blue-600 border-blue-600 text-white" : simStep === 2 ? "bg-slate-900 border-blue-500 text-blue-400 animate-pulse" : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}>
                        {simStep > 2 ? "✓" : "2"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">Inventory Allocation</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Locks units in local warehouse racks to prevent double-booking.</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className={`flex items-start gap-4 transition-all duration-300 ${simStep >= 3 ? "opacity-100" : "opacity-30"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border font-bold text-sm ${
                        simStep > 3 ? "bg-blue-600 border-blue-600 text-white" : simStep === 3 ? "bg-slate-900 border-blue-500 text-blue-400 animate-pulse" : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}>
                        {simStep > 3 ? "✓" : "3"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">Carrier Optimization</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Queries UPS, FedEx & DHL for best rate and prints label PDF.</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className={`flex items-start gap-4 transition-all duration-300 ${simStep >= 4 ? "opacity-100" : "opacity-30"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border font-bold text-sm ${
                        simStep === 4 ? "bg-emerald-600 border-emerald-600 text-white" : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}>
                        {simStep === 4 ? "✓" : "4"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 font-sans">Dispatch Sync</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Finalizes dispatch workflow, syncs catalog, and notifies customer.</p>
                      </div>
                    </div>

                  </div>

                  {/* Flow Map Visualizer */}
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono">Routing Progress</p>
                    <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-mono">Shopify</span>
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${simStep >= 1 ? "bg-blue-500" : "bg-slate-700"}`} />
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${simStep >= 2 ? "bg-blue-500" : "bg-slate-800"}`} />
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-mono">Allocation</span>
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${simStep >= 2 ? "bg-blue-500" : "bg-slate-700"}`} />
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${simStep >= 3 ? "bg-blue-500" : "bg-slate-800"}`} />
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-mono">FedEx</span>
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${simStep >= 3 ? "bg-blue-500" : "bg-slate-700"}`} />
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${simStep >= 4 ? "bg-emerald-500" : "bg-slate-800"}`} />
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-mono">Dock</span>
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${simStep >= 4 ? "bg-emerald-500" : "bg-slate-700"}`} />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Console Logs */}
                <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col h-[280px] md:h-full">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono block">System Console Output</span>
                  <div className="flex-1 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-2 leading-relaxed">
                    {simLogs.length === 0 ? (
                      <p className="text-slate-500 italic select-none">Console idle. Click &quot;Start Simulation&quot; above to initialize pipeline.</p>
                    ) : (
                      simLogs.map((log, i) => (
                        <p key={i} className="animate-fade-in">{log}</p>
                      ))
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>Engine Status:</span>
                    <span className={`font-bold uppercase ${
                      simStatus === "Completed" ? "text-emerald-400" : simStatus === "Processing" ? "text-amber-400 animate-pulse" : "text-slate-500"
                    }`}>{simStatus}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Core Capabilities Section (Bento Grid) */}
        <section id="features" className="py-28 bg-white scroll-mt-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Designed to automate your workflow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">completely.</span>
              </h2>
              <p className="mt-4 text-slate-500 text-lg">
                LogiTrack features core logistics abstractions that replace manual tracking sheets forever.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Feature 1 */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                    <InventoryIcon />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Real-Time Inventory Sync</h3>
                  <p className="text-slate-500 mt-3 text-sm leading-relaxed max-w-md">
                    Synchronize your catalog across Shopify, Amazon, WooCommerce, and eBay instantly. Avoid oversells and secure stock counts dynamically.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer">
                  <span>Explore catalog manager</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                    <ShippingIcon />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Smart Label Dispatch</h3>
                  <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                    Instantly query rates, buy carrier services (FedEx, UPS, DHL), and print shipping barcodes in batches with one click.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer">
                  <span>Check carrier integrations</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                    <OrderIcon />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Unified Command Center</h3>
                  <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                    Track pick queues, pack tasks, and warehouse zoning layouts from a single consolidated dashboard.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer">
                  <span>View dashboard controls</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                    <BillingIcon />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Compliance Billing System</h3>
                  <p className="text-slate-500 mt-3 text-sm leading-relaxed max-w-md">
                    VeriFactu compatible invoicing tools, logs, and reconciliation options out of the box. Automate audits with minimal friction.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer">
                  <span>Review legal frameworks</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Partners & Integrations Marquee Section */}
        <section id="integrations" className="py-24 bg-slate-50 overflow-hidden border-y border-slate-200/60 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Integrations you already <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">trust.</span>
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              We sync with your existing tech stack instantly, without custom code or long installations.
            </p>
          </div>

          {/* Infinite Marquee Ticker */}
          <div className="relative w-full flex items-center justify-center overflow-hidden py-6 bg-white border-y border-slate-200/50 shadow-sm">
            <div className="w-full max-w-7xl overflow-hidden px-4">
              <div className="animate-marquee gap-16 items-center">
                {/* First cycle */}
                {integrationLogos.map((logo, idx) => (
                  <div key={`logo-1-${idx}`} className="mx-8 w-[130px] h-[55px] flex items-center justify-center shrink-0">
                    <img
                      alt={logo.alt}
                      className="max-w-full max-h-full object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                      src={logo.src}
                    />
                  </div>
                ))}
                {/* Second cycle for infinite scroll */}
                {integrationLogos.map((logo, idx) => (
                  <div key={`logo-2-${idx}`} className="mx-8 w-[130px] h-[55px] flex items-center justify-center shrink-0">
                    <img
                      alt={logo.alt}
                      className="max-w-full max-h-full object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                      src={logo.src}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-lg shadow-sm hover:shadow-md hover:from-slate-900 hover:to-slate-950 transition-all"
            >
              <span>Explore Ecosystem</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24 bg-white scroll-mt-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              
              {/* Text Content */}
              <div className="lg:w-1/2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Maximize speed. Eliminate errors.
                </h2>
                <p className="mt-4 text-slate-500 leading-relaxed text-base">
                  By moving from spreadsheets to LogiTrack, businesses unlock key operational growth vectors.
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mt-6 mb-12 rounded-full"></div>
                
                <ul className="space-y-8">
                  <li className="flex gap-4 group">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg font-bold transition-all group-hover:bg-blue-600 group-hover:text-white">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Expand Multi-Channel Reach</h4>
                      <p className="text-slate-500 mt-1 leading-relaxed text-sm">
                        Synchronize listings across 15+ marketplaces to boost catalog visibility without manual listing adjustments.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4 group">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg font-bold transition-all group-hover:bg-blue-600 group-hover:text-white">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Reduce Manual Touchpoints</h4>
                      <p className="text-slate-500 mt-1 leading-relaxed text-sm">
                        Instantly trigger label generation, picklists routing, and shipping logs automatically at dispatch.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4 group">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg font-bold transition-all group-hover:bg-blue-600 group-hover:text-white">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Zero-Tolerance Mismatch Policy</h4>
                      <p className="text-slate-500 mt-1 leading-relaxed text-sm">
                        Smart serial counts, wave pick audits, and packaging validations safeguard inventory levels from variance.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Visual Presentation Card */}
              <div className="lg:w-1/2 w-full relative">
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 shadow-xl overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                  <img
                    alt="Efficiency Mockup Presentation"
                    className="w-full rounded-xl object-cover hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzdt6PMTnkIhjwb2WSKQ_cgeAhVj__f3gKhwHfQPP5mqmHq9DzC77ih8rvAu6wNaGBl11gWBaAKtjtezyKyDnWhXFYQvCoW_Y_dG1AkNdH65tnCSv248FxyYPlvJlDwv0k36safZpS28ZZaXs-Ul8mAjqQjb5cfb4qDJJjf4HAmNDSuBLTT8Ig7Lf2xcSpQdF1Vji1hlxVD5EfnA572mJeSZX-RxxOFgtS63EAJBzbYtBuJH3ADjXeuMQHaGz39lhSfi2SidEJMvmd"
                  />
                </div>
                {/* Background Shadow */}
                <div className="absolute -top-4 -left-4 w-full h-full bg-violet-600/5 -z-10 rounded-2xl blur-lg" />
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200/50 scroll-mt-16">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
              <p className="mt-3 text-slate-500 text-sm">Everything you need to know about the LogiTrack infrastructure.</p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors duration-150"
                  >
                    <span className="font-bold text-slate-800 text-base">{item.q}</span>
                    <span className="material-symbols-outlined text-slate-400 select-none transition-transform duration-200" style={{
                      transform: activeFaq === idx ? "rotate(180deg)" : "rotate(0deg)"
                    }}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${
                    activeFaq === idx ? "max-h-[300px] border-t border-slate-100" : "max-h-0 pointer-events-none"
                  } overflow-hidden`}>
                    <p className="px-6 py-5 text-slate-600 text-sm leading-relaxed bg-slate-50/20">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-28 bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-950 text-white text-center relative overflow-hidden">
          
          {/* Background grid/overlay */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[130px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Scale your logistics, not your workload.
            </h2>
            <p className="text-blue-100/80 mt-6 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
              Start your 14-day risk-free trial today. Pay nothing if it doesn&apos;t match your operational needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="px-10 py-5 bg-white text-blue-900 hover:bg-slate-100 font-extrabold text-lg rounded-lg shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 w-full sm:w-auto"
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                className="px-8 py-5 border border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-bold text-base rounded-lg transition-all w-full sm:w-auto"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900 relative z-10" data-purpose="site-footer">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-md"></div>
                <span className="text-white text-lg font-bold">LogiTrack</span>
              </div>
              <p className="text-xs leading-relaxed mb-6 text-slate-500">
                LogiTrack WMS delivers real-time warehouse orchestration, order pipelines routing, and automated carrier compliance globally.
              </p>
              <div className="flex space-x-4">
                <a className="text-slate-600 hover:text-white transition-colors" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a className="text-slate-600 hover:text-white transition-colors" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.011 3.625-.069 4.903c-.149 3.228-1.687 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.625.07-4.903c.149-3.228 1.687-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h5 className="text-white font-bold mb-6 text-sm">Capabilities</h5>
              <ul className="space-y-4 text-xs font-medium">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors cursor-pointer">Inventory Manager</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors cursor-pointer">Invoicing Core</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors cursor-pointer">Batch Labeler</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors cursor-pointer">Channel Connect</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 text-sm">Integrations</h5>
              <ul className="space-y-4 text-xs font-medium">
                <li><button onClick={() => scrollToSection("integrations")} className="hover:text-white transition-colors cursor-pointer">Amazon Web Services</button></li>
                <li><button onClick={() => scrollToSection("integrations")} className="hover:text-white transition-colors cursor-pointer">eBay Developer</button></li>
                <li><button onClick={() => scrollToSection("integrations")} className="hover:text-white transition-colors cursor-pointer">Shopify GraphQL</button></li>
                <li><button onClick={() => scrollToSection("integrations")} className="hover:text-white transition-colors cursor-pointer">WooCommerce REST</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 text-sm">Shipping partners</h5>
              <ul className="space-y-4 text-xs font-medium">
                <li><button onClick={() => scrollToSection("integrations")} className="hover:text-white transition-colors cursor-pointer">UPS API</button></li>
                <li><button onClick={() => scrollToSection("integrations")} className="hover:text-white transition-colors cursor-pointer">FedEx Direct</button></li>
                <li><a className="hover:text-white transition-colors" href="#">DHL Developer</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Correos API</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 text-sm">Company</h5>
              <ul className="space-y-4 text-xs font-medium">
                <li><a className="hover:text-white transition-colors" href="#">About Us</a></li>
                <li><button onClick={() => scrollToSection("simulator")} className="hover:text-white transition-colors cursor-pointer">Live Demo Widget</button></li>
                <li><a className="hover:text-white transition-colors" href="#">Compliances</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Contact Sales</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
            <p>© 2026 LogiTrack WMS. All rights reserved. Industrial Precision Theme.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
