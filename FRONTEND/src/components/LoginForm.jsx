import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password, role);
    if (res.success) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
      />
      <label>Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        type="password"
      />
      <label>Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button className="btn" type="submit">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
