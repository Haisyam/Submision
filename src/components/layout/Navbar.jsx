function Navbar({ variant = "public" }) {
  return (
    <header className="site-header">
      <div className="brand">
        <img
          className="brand__logo"
          src="https://static.canva.com/domain-assets/canva/static/images/android-192x192-2.png"
          alt="Canva logo"
          loading="lazy"
          decoding="async"
        />
        <div className="brand__text">
          <span className="brand__name">Canva Claim</span>
          <span className="brand__meta">
            Claim Canva Pro Lifetime untuk divisi Kominfo
          </span>
        </div>
      </div>
      <div className="site-header__status">
        <span className="pill">
          {variant === "admin" ? "Admin Dashboard" : "Formulir Resmi"}
        </span>
      </div>
    </header>
  );
}

export default Navbar;
