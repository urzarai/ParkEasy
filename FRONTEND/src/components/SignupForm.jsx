import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    empId: "",
  });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, mobile, empId } = form;
    const res = await signup(name, email, password, mobile, empId);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <label>Name</label>
      <input name="name" value={form.name} onChange={onChange} required />
      <label>Email</label>
      <input
        name="email"
        value={form.email}
        onChange={onChange}
        required
        type="email"
      />
      <label>Password</label>
      <input
        name="password"
        value={form.password}
        onChange={onChange}
        required
        type="password"
      />
      <label>Mobile</label>
      <input name="mobile" value={form.mobile} onChange={onChange} required />
      <label>Employee ID</label>
      <input name="empId" value={form.empId} onChange={onChange} required />
      <button className="btn" type="submit">
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;
