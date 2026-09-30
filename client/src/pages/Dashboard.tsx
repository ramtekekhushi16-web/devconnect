import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/api";
import { useAuthStore } from "../store/authStore";

function Dashboard() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    if (!name.trim()) {
      setMessage("Name is required.");
      return;
    }

    try {
      setLoading(true);

      const result = await updateProfile(token, {
        name,
        bio,
        location,
        githubUrl,
        linkedinUrl,
      });

      if (!result.success) {
        setMessage(result.message || "Unable to update profile.");
        return;
      }

      login(result.data.user, token);

      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (error: any) {
      setMessage(
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
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          height: "70px",
          background: "#111827",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <h2 style={{ margin: 0 }}>DevConnect</h2>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            border: "1px solid #374151",
            borderRadius: "8px",
            background: "#1f2937",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Welcome */}
        <section
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <h1 style={{ marginTop: 0 }}>
            Welcome, {user?.name || "Developer"} 👋
          </h1>

          <p style={{ color: "#6b7280" }}>
            Build your developer profile, showcase your projects and connect
            with other developers.
          </p>
        </section>

        {/* Profile */}
        <section
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <h2>Your Profile</h2>

          {!editing ? (
            <>
              <p>
                <strong>Name:</strong> {user?.name || "Not available"}
              </p>

              <p>
                <strong>Email:</strong> {user?.email || "Not available"}
              </p>

              <p>
                <strong>Bio:</strong>{" "}
                {user?.bio || "No bio added yet."}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {user?.location || "Not added"}
              </p>

              {user?.githubUrl && (
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {user.githubUrl}
                  </a>
                </p>
              )}

              {user?.linkedinUrl && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {user.linkedinUrl}
                  </a>
                </p>
              )}

              <button
                onClick={() => {
                  setName(user?.name || "");
                  setBio(user?.bio || "");
                  setLocation(user?.location || "");
                  setGithubUrl(user?.githubUrl || "");
                  setLinkedinUrl(user?.linkedinUrl || "");
                  setMessage("");
                  setEditing(true);
                }}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={inputStyle}
              />

              <label>Bio</label>

              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell developers about yourself"
                rows={4}
                style={inputStyle}
              />

              <label>Location</label>

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Maharashtra, India"
                style={inputStyle}
              />

              <label>GitHub URL</label>

              <input
                type="url"
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                placeholder="https://github.com/username"
                style={inputStyle}
              />

              <label>LinkedIn URL</label>

              <input
                type="url"
                value={linkedinUrl}
                onChange={(event) => setLinkedinUrl(event.target.value)}
                placeholder="https://linkedin.com/in/username"
                style={inputStyle}
              />

              {message && (
                <p
                  style={{
                    color: message.includes("successfully")
                      ? "#16a34a"
                      : "#dc2626",
                  }}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "11px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  padding: "11px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </section>

        {/* Feature cards */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <FeatureCard
            title="🚀 Projects"
            text="Showcase your development projects and technologies."
          />

          <FeatureCard
            title="📝 Technical Blogs"
            text="Write and share technical articles with developers."
          />

          <FeatureCard
            title="🤝 Connections"
            text="Connect with developers and grow your network."
          />

          <FeatureCard
            title="⭐ Skills"
            text="Display your technical skills and receive endorsements."
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
      }}
    >
      <h3>{title}</h3>

      <p style={{ color: "#6b7280" }}>{text}</p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxSizing: "border-box" as const,
  fontSize: "15px",
};

export default Dashboard;