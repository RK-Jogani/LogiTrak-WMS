"use client";

import { useState } from "react";

const templates = [
  {
    id: "standard",
    name: "Standard 3PL",
    icon: "inventory_2",
    description: "A versatile layout optimized for general storage, standard picking operations, and long-term bulk holding.",
    zones: ["Receiving & Putaway", "Bulk Storage (Racks/Floor)", "Standard Pick Face"],
  },
  {
    id: "ecommerce",
    name: "E-commerce Fulfillment",
    icon: "local_mall",
    description: "High-velocity layout designed for single-item picking, rapid packing stations, and integrated returns processing.",
    zones: ["High-Density Forward Pick", "Multi-line Pack Stations", "Returns/QA Processing"],
    recommended: true,
  },
  {
    id: "crossdock",
    name: "Cross-docking Focus",
    icon: "forklift",
    description: "Minimal storage layout prioritizing rapid transfer of goods directly from inbound receiving to outbound shipping.",
    zones: ["Inbound Staging Grid", "Sortation / Breakdown", "Outbound Dock Doors"],
  },
];

export default function OnboardingZonesPage() {
  const [selected, setSelected] = useState("ecommerce");

  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col font-sans antialiased">
      {/* Top Bar */}
      <header className="bg-surface border-b border-low px-container-margin-desktop h-16 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary">LogiTrack Setup</span>
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-label-md text-label-md uppercase tracking-wider">
          Save &amp; Exit
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-container-margin-mobile md:px-container-margin-desktop flex flex-col">
        {/* Progress Stepper */}
        <div className="w-full max-w-3xl mx-auto mb-16">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant rounded-full -z-10" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[66.66%] h-1 bg-primary rounded-full -z-10 transition-all duration-500" />
            {/* Step 1: Done */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined fill text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <span className="font-label-md text-label-md text-primary uppercase absolute -bottom-6 whitespace-nowrap">Facility Info</span>
            </div>
            {/* Step 2: Done */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined fill text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <span className="font-label-md text-label-md text-primary uppercase absolute -bottom-6 whitespace-nowrap">Inventory Rules</span>
            </div>
            {/* Step 3: Current */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-surface border-4 border-primary text-primary flex items-center justify-center shadow-md ring-4 ring-primary-container">
                <span className="font-headline-sm text-headline-sm leading-none">3</span>
              </div>
              <span className="font-label-md text-label-md text-primary uppercase absolute -bottom-6 whitespace-nowrap font-bold">Zone Setup</span>
            </div>
            {/* Step 4: Pending */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-bg-subtle border-2 border-outline-variant text-outline-variant flex items-center justify-center">
                <span className="font-headline-sm text-headline-sm leading-none">4</span>
              </div>
              <span className="font-label-md text-label-md text-outline-variant uppercase absolute -bottom-6 whitespace-nowrap">Import Data</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-display-lg font-bold text-on-background mb-4">Select Facility Layout</h1>
          <p className="text-body-lg text-on-surface-variant">Choose a foundational template that best matches your operational flow. You can customize specific zones and aisles in the next step.</p>
        </div>

        {/* Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-12" role="radiogroup">
          {templates.map((t) => {
            const isActive = selected === t.id;
            return (
              <div
                key={t.id}
                role="radio"
                aria-checked={isActive}
                tabIndex={0}
                onClick={() => setSelected(t.id)}
                className={`relative bg-surface border rounded-xl p-6 cursor-pointer transition-all duration-200 flex flex-col h-full group
                  ${isActive ? "border-2 border-primary bg-surface-container-low shadow-md ring-2 ring-primary/20" : "border-low hover:shadow-lg hover:border-outline-variant"}`}
              >
                {t.recommended && (
                  <div className="absolute -top-3 right-4 bg-primary text-on-primary font-label-md text-[10px] uppercase px-3 py-1 rounded-full shadow-sm">Recommended</div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-primary text-on-primary shadow-inner" : "bg-surface-container text-secondary group-hover:text-primary"}`}>
                    <span className="material-symbols-outlined text-[28px]">{t.icon}</span>
                  </div>
                  <span className={`material-symbols-outlined transition-colors text-[24px] ${isActive ? "text-primary" : "text-outline"}`}>
                    {isActive ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{t.name}</h3>
                <p className="text-body-md text-on-surface-variant mb-6 flex-1">{t.description}</p>
                <div className="pt-4 border-t border-low">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3 block">Pre-configured Zones</span>
                  <ul className="space-y-2">
                    {t.zones.map((zone) => (
                      <li key={zone} className="flex items-center gap-2 text-body-md text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span>
                        {zone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start from scratch */}
        <div className="flex justify-center mb-12">
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-body-md px-4 py-2 rounded-lg hover:bg-surface-variant">
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            Or start with a blank layout and build custom zones
          </button>
        </div>

        {/* Action Bar */}
        <div className="mt-auto pt-6 border-t border-low flex items-center justify-between">
          <button className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container hover:text-primary transition-colors shadow-sm flex items-center gap-2 group">
            Continue to Zone Editing
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
