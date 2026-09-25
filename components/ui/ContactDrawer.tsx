"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import gsap from "gsap";
import { useUIStore } from "@/lib/store/useUIStore";
import PillButton from "@/components/ui/PillButton";

const SERVICE_OPTIONS = [
  "WebGL & 3D Interactive",
  "Creative Tech & Shaders",
  "Motion & Brand Direction",
  "Design Systems & UI Engineering",
  "Generative / R&D Prototypes",
];

const BUDGET_OPTIONS = [
  "< $25K",
  "$25K – $50K",
  "$50K – $100K",
  "$100K+",
];

interface FormErrors {
  name?: string;
  email?: string;
  brief?: string;
}

export default function ContactDrawer() {
  const { isContactDrawerOpen, closeContactDrawer } = useUIStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const nameId = useId();
  const emailId = useId();
  const companyId = useId();
  const timelineId = useId();
  const briefId = useId();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [timeline, setTimeline] = useState("Flexible");
  const [selectedServices, setSelectedServices] = useState<string[]>(["WebGL & 3D Interactive"]);
  const [selectedBudget, setSelectedBudget] = useState<string>("$50K – $100K");
  const [brief, setBrief] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isContactDrawerOpen) {
        closeContactDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isContactDrawerOpen, closeContactDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (isContactDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isContactDrawerOpen]);

  // GSAP Slide-up Animation
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isContactDrawerOpen) {
      gsap.killTweensOf([drawer, backdrop]);
      if (prefersReducedMotion) {
        gsap.set(backdrop, { opacity: 1, pointerEvents: "auto" });
        gsap.set(drawer, { yPercent: 0, opacity: 1 });
      } else {
        gsap.set(backdrop, { pointerEvents: "auto" });
        gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(
          drawer,
          { yPercent: 100, opacity: 0.8 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.55,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            onComplete: () => {
              nameInputRef.current?.focus();
            },
          }
        );
      }
    } else {
      gsap.killTweensOf([drawer, backdrop]);
      if (prefersReducedMotion) {
        gsap.set(backdrop, { opacity: 0, pointerEvents: "none" });
        gsap.set(drawer, { yPercent: 100, opacity: 0 });
      } else {
        gsap.to(backdrop, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(backdrop, { pointerEvents: "none" });
          },
        });
        gsap.to(drawer, {
          yPercent: 100,
          opacity: 0.8,
          duration: 0.4,
          ease: "power3.in",
        });
      }
    }
  }, [isContactDrawerOpen]);

  // Toggle service chip
  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Please provide your name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Please provide a valid corporate or personal email address.";
    }

    if (!brief.trim() || brief.trim().length < 10) {
      newErrors.brief = "Please describe your project or inquiry (minimum 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate high-end network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  // Reset form
  const handleReset = () => {
    setName("");
    setEmail("");
    setCompany("");
    setBrief("");
    setSelectedServices(["WebGL & 3D Interactive"]);
    setSelectedBudget("$50K – $100K");
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md opacity-0 pointer-events-none flex items-end justify-center transition-opacity"
      aria-hidden={!isContactDrawerOpen}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          closeContactDrawer();
        }
      }}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-drawer-title"
        className="w-full max-w-4xl bg-[#0D0E12] border-t sm:border border-white/15 rounded-t-card-lg sm:rounded-card-lg max-h-[90vh] overflow-y-auto shadow-2xl text-white p-6 sm:p-10 flex flex-col gap-8 transform translate-y-full"
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-[11px] font-mono text-accent-cyan uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span>DIRECT INQUIRY CHANNEL // COMMISSIONS</span>
            </div>
            <h2 id="contact-drawer-title" className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              START A CONVERSATION
            </h2>
            <p className="text-xs sm:text-sm text-secondary-dark">
              Tell us about your project, timeline, and vision. We will respond within 24 hours.
            </p>
          </div>

          <button
            type="button"
            onClick={closeContactDrawer}
            className="p-2 sm:p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all select-none"
            aria-label="Close Contact Drawer"
            data-cursor="hover"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className="py-12 flex flex-col items-center text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan flex items-center justify-center text-accent-cyan">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                INQUIRY PROTOCOL TRANSMITTED
              </h3>
              <p className="text-sm text-secondary-dark leading-relaxed">
                Thank you, {name}. Your inquiry has been logged into our studio dispatch queue. Our creative technology directors will review your brief and schedule an exploratory technical session.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <PillButton
                label="CLOSE WINDOW"
                variant="dark"
                onClick={closeContactDrawer}
              />
              <PillButton
                label="SEND ANOTHER"
                variant="outline"
                className="text-white border-white/20"
                onClick={handleReset}
              />
            </div>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Service Chips Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-secondary-dark flex items-center gap-2">
                <span>01 // SELECT RELEVANT CAPABILITIES</span>
                <span className="text-white/40 text-[10px]">(MULTI-SELECT)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {SERVICE_OPTIONS.map((service) => {
                  const active = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      data-cursor="hover"
                      className={`px-3.5 py-2 rounded-full text-xs font-mono transition-all duration-200 border ${
                        active
                          ? "bg-accent-cyan/15 text-accent-cyan border-accent-cyan shadow-[0_0_12px_rgba(45,226,230,0.2)]"
                          : "bg-white/5 text-white/70 border-white/10 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Range Selector */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-secondary-dark flex items-center gap-2">
                <span>02 // ESTIMATED BUDGET SCOPE</span>
                <span className="text-white/40 text-[10px]">(USD)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BUDGET_OPTIONS.map((budget) => {
                  const active = selectedBudget === budget;
                  return (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => setSelectedBudget(budget)}
                      data-cursor="hover"
                      className={`px-3 py-2.5 rounded-card text-xs font-mono text-center transition-all duration-200 border ${
                        active
                          ? "bg-white text-primary-light font-semibold border-white shadow-md"
                          : "bg-white/5 text-white/75 border-white/10 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {budget}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-secondary-dark">
                03 // PARTICIPANT DETAILS & TIMELINE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor={nameId} className="text-xs font-mono text-white/80">
                    YOUR NAME *
                  </label>
                  <input
                    ref={nameInputRef}
                    id={nameId}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Ada Lovelace"
                    className={`w-full px-4 py-3 rounded-card bg-white/5 border text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                      errors.name
                        ? "border-red-500 focus:border-red-400"
                        : "border-white/15 focus:border-accent-cyan"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-mono text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor={emailId} className="text-xs font-mono text-white/80">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="ada@creative-studio.io"
                    className={`w-full px-4 py-3 rounded-card bg-white/5 border text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                      errors.email
                        ? "border-red-500 focus:border-red-400"
                        : "border-white/15 focus:border-accent-cyan"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-mono text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Company / Brand */}
                <div className="space-y-1.5">
                  <label htmlFor={companyId} className="text-xs font-mono text-white/80">
                    ORGANIZATION / BRAND (OPTIONAL)
                  </label>
                  <input
                    id={companyId}
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Future Systems Inc."
                    className="w-full px-4 py-3 rounded-card bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                {/* Timeline */}
                <div className="space-y-1.5">
                  <label htmlFor={timelineId} className="text-xs font-mono text-white/80">
                    DESIRED TIMELINE
                  </label>
                  <select
                    id={timelineId}
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-3 rounded-card bg-[#151720] border border-white/15 text-sm text-white focus:outline-none focus:border-accent-cyan transition-colors"
                  >
                    <option value="Immediate (< 1 month)">Immediate (&lt; 1 month)</option>
                    <option value="Q3 / Q4 2026">Q3 / Q4 2026</option>
                    <option value="Early 2027">Early 2027</option>
                    <option value="Flexible / Exploratory">Flexible / Exploratory</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Brief / Message */}
            <div className="space-y-1.5">
              <label htmlFor={briefId} className="text-xs font-mono uppercase tracking-wider text-secondary-dark flex justify-between">
                <span>04 // PROJECT VISION OR BRIEF *</span>
                <span className="text-white/40">{brief.length} characters</span>
              </label>
              <textarea
                id={briefId}
                rows={4}
                required
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  if (errors.brief) setErrors((prev) => ({ ...prev, brief: undefined }));
                }}
                placeholder="Give us an overview of your creative ambitions, required tech stack, or specific challenges to solve..."
                className={`w-full px-4 py-3 rounded-card bg-white/5 border text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors resize-y ${
                  errors.brief
                    ? "border-red-500 focus:border-red-400"
                    : "border-white/15 focus:border-accent-cyan"
                }`}
              />
              {errors.brief && (
                <p className="text-[11px] font-mono text-red-400">{errors.brief}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-secondary-dark">
                <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                <span>CONFIDENTIAL COMMISSIONS ONLY // ZERO SPAM</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <PillButton
                  label="CANCEL"
                  variant="outline"
                  className="text-white border-white/20"
                  onClick={closeContactDrawer}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor="hover"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-accent-cyan text-primary-light font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 disabled:opacity-50 select-none shadow-lg active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-primary-light border-t-transparent animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <>
                      <span>TRANSMIT INQUIRY</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
