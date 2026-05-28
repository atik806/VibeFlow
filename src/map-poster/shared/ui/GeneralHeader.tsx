import { InfoIcon } from "@/map-poster/shared/ui/Icons";
import SocialLinkGroup from "@/map-poster/shared/ui/SocialLinkGroup";

interface GeneralHeaderProps {
  onAboutOpen: () => void;
}

export default function GeneralHeader({ onAboutOpen }: GeneralHeaderProps) {
  return (
    <header className="general-header">
      <div className="desktop-brand">
        <img
          className="desktop-brand-logo brand-logo"
          src="/assets/logo.svg"
          alt="VibeFlow logo"
        />
        <div className="desktop-brand-copy brand-copy">
          <h1 className="desktop-brand-title">VibeFlow</h1>
          <p className="desktop-brand-kicker app-kicker">
            Map Poster & Wallpaper Creator
          </p>
        </div>
      </div>

      <a href="/" className="general-header-back-btn" title="Back to Website">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span className="general-header-back-label">Back to Website</span>
      </a>

      <div className="general-header-actions">
        <SocialLinkGroup variant="header" />
        <button
          type="button"
          className="general-header-text-btn general-header-about-text-btn"
          onClick={onAboutOpen}
          aria-label="About"
          title="About"
        >
          <span className="general-header-btn-label">About</span>
          <span className="general-header-btn-icon" aria-hidden="true">
            <InfoIcon />
          </span>
        </button>
      </div>
    </header>
  );
}
