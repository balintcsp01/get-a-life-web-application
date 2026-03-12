import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthModal({ isOpen, initialMode = "login", onClose }) {
  const normalizedMode = initialMode === "register" ? "register" : "login";
  const [mode, setMode] = useState(normalizedMode);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    setMode(normalizedMode);
    setForm(EMPTY_FORM);
    setError("");
    setLoading(false);
  }, [isOpen, normalizedMode]);

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.username.trim()) return "Username is required";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      const validationError = validate();
      if (validationError) {
        setError(validationError);
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Error */}
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}

        {/* Mode toggle */}
        <div className="mt-5 flex rounded-full bg-base-200 p-1">
          {["login", "register"].map((m) => (
            <button
              key={m}
              type="button"
              className={`btn btn-sm flex-1 rounded-full ${mode === m ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setMode(m)}
            >
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === "login" ? (
            <LoginForm form={form} onChange={handleFieldChange} loading={loading} />
          ) : (
            <RegisterForm form={form} onChange={handleFieldChange} loading={loading} />
          )}
        </form>
      </div>
    </div>
  );
}
