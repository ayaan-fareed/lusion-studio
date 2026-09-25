import HeroSection from "@/components/sections/HeroSection";
import BrandStatement from "@/components/sections/BrandStatement";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ClimaxSection from "@/components/sections/ClimaxSection";
import StudioFooter from "@/components/sections/StudioFooter";
import ContactDrawer from "@/components/ui/ContactDrawer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-light text-primary-light flex flex-col justify-between pt-24 sm:pt-28">
      {/* Phase 3 Hero Section with Interactive 3D Jacks Canvas */}
      <HeroSection />

      {/* Phase 4 Brand Statement & Expanding Showreel Stage */}
      <BrandStatement />

      {/* Phase 5 Featured Work Grid with 2-Column Offset & Video Scrub */}
      <FeaturedWork />

      {/* Phase 7 Climax 3D Astronaut Experience */}
      <ClimaxSection />

      {/* Design System Verification & Token Strip */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full pt-16 pb-8 space-y-8">
        <div className="flex justify-between items-center border-t border-b border-border-subtle-light py-5">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-secondary-light font-mono">
              SYSTEM PROTOCOL // PHASE 8: STUDIO FOOTER &amp; CONTACT DRAWER ACTIVE
            </span>
          </div>
          <span className="text-xs font-mono text-secondary-light hidden sm:inline-block">
            KINETIC MARQUEE + REAL-TIME TIMEZONE CLOCKS + VALIDATED INQUIRY DRAWER
          </span>
        </div>

        {/* Palette Token Verification Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div data-cursor="hover" className="p-4 rounded-card bg-bg-dark text-white space-y-2 transition-transform duration-200 hover:-translate-y-1">
            <div className="w-4 h-4 rounded-full bg-accent-cyan" />
            <p className="text-xs font-mono text-secondary-dark">Void Dark</p>
            <p className="text-sm font-semibold">#0A0A0C</p>
          </div>
          <div data-cursor="view" data-cursor-text="VIEW" className="p-4 rounded-card bg-white border border-border-subtle-light text-primary-light space-y-2 transition-transform duration-200 hover:-translate-y-1">
            <div className="w-4 h-4 rounded-full bg-bg-light border border-border-subtle-light" />
            <p className="text-xs font-mono text-secondary-light">Light Neutral</p>
            <p className="text-sm font-semibold">#F5F5F7</p>
          </div>
          <div data-cursor="drag" data-cursor-text="DRAG" className="p-4 rounded-card bg-accent-blush text-primary-light space-y-2 transition-transform duration-200 hover:-translate-y-1">
            <div className="w-4 h-4 rounded-full bg-[#E5D4D4]" />
            <p className="text-xs font-mono text-secondary-light">Blush Accent</p>
            <p className="text-sm font-semibold">#F2E6E6</p>
          </div>
          <div data-cursor="hover" className="p-4 rounded-card bg-accent-cyan text-bg-dark space-y-2 transition-transform duration-200 hover:-translate-y-1">
            <div className="w-4 h-4 rounded-full bg-bg-dark" />
            <p className="text-xs font-mono text-bg-dark/70">Cyan Glow</p>
            <p className="text-sm font-semibold">#2DE2E6</p>
          </div>
        </section>
      </div>

      {/* Phase 8 Interactive Studio Footer */}
      <StudioFooter />

      {/* Phase 8 Interactive Contact Drawer */}
      <ContactDrawer />
    </main>
  );
}
