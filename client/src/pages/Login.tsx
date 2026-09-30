import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuthStore } from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(email, password);

      if (!result.success) {
        setError(result.message || "Login failed.");
        return;
      }

      login(result.data.user, result.data.token);

      navigate("/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to connect to the DevConnect server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>DevConnect</h1>

        <h2>Welcome back</h2>

        <p style={{ color: "#666" }}>
          Login to your developer account.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <div
              style={{
                color: "#dc2626",
                background: "#fee2e2",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: "#111827",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "25px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;