import { useSearchParams } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import SignupForm from "../components/SignupForm.jsx";

function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div className="auth-page">
      {mode === "signup" ? <SignupForm /> : <LoginForm />}
    </div>
  );
}

export default Auth;
