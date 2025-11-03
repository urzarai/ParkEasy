import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-container">
      <h1>Welcome to ParkEasy</h1>
      <div className="btn-group">
        <Link className="btn" to="/auth?mode=login">
          Login
        </Link>
        <Link className="btn" to="/auth?mode=signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
