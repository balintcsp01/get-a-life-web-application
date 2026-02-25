import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthModal({ isOpen, initialMode = "login", onClose }) {
  const normalizedInitialMode = initialMode === "register" ? "register" : "login";
  const [mode, setMode] = useState(normalizedInitialMode);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    setMode(normalizedInitialMode);
    setForm(EMPTY_FORM);
    setError("");
    setLoading(false);
  }, [isOpen, normalizedInitialMode]);

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (mode === "register") {
      if (!form.username.trim()) {
        setError("Username is required");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
    }

    setLoading(true);

    const result =
      mode === "login"
        ? await login(form.email, form.password)
        : await register(form.username, form.email, form.password);

    setLoading(false);

    if (result.success) {
      handleClose();
      return;
    }

    setError(
      result.error ||
        (mode === "login"
          ? "Login failed. Please check your credentials."
          : "Registration failed. Please try again.")
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      data-theme="retro"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome to Get a Life</h2>
            <p className="text-sm opacity-70">
              Login or create an account to save your favorite hobbies
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5 flex rounded-full bg-base-200 p-1">
          <button
            type="button"
            className={`btn btn-sm flex-1 rounded-full ${
              mode === "login" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`btn btn-sm flex-1 rounded-full ${
              mode === "register" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === "register" && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="johndoe"
                className="input input-bordered w-full"
                value={form.username}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, username: event.target.value }))
                }
                required
              />
            </div>
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="input input-bordered w-full"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
              minLength={mode === "register" ? 6 : undefined}
            />
          </div>

          {mode === "register" && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: event.target.value,
                  }))
                }
                required
              />
            </div>
          )}

          <div className="form-control pt-2">
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Login"
                  : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

