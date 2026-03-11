import FormField from "./FormField";

export default function LoginForm({ form, onChange, loading }) {
  return (
    <>
      <FormField
        label="Email"
        type="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={(value) => onChange("email", value)}
        required
      />
      <FormField
        label="Password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={(value) => onChange("password", value)}
        required
      />
      <div className="form-control pt-2">
        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </>
  );
}
