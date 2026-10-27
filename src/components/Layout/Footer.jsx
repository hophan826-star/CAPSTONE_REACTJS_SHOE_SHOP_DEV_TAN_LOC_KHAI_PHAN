import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>GET HELP</h4>
          <Link to="/">Home</Link>
          <Link to="/category/NIKE">Nike</Link>
          <Link to="/category/ADIDAS">Adidas</Link>
          <Link to="/stores">Stores</Link>
        </div>
        <div className="footer-col">
          <h4>SUPPORT</h4>
          <Link to="/stores">About</Link>
          <Link to="/stores">Contact</Link>
          <Link to="/stores">Help</Link>
          <Link to="/stores">Phone</Link>
        </div>
        <div className="footer-col">
          <h4>REGISTER</h4>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 Cybersoft All Rights Reserved | Design Theme by Tấn Lộc & Khải
          Phan.
        </p>
        <span className="dev-badge">
          <i className="dev-dot"></i>Dev Loc CD
        </span>
      </div>
    </footer>
  );
}
