import FormField from "./FormField";

export default function RegisterForm({ form, onChange, loading }) {
  return (
    <>
      <FormField
        label="Username"
        placeholder="johndoe"
        value={form.username}
        onChange={(value) => onChange("username", value)}
        required
      />
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
        minLength={6}
      />
      <FormField
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={(value) => onChange("confirmPassword", value)}
        required
      />
      <div className="form-control pt-2">
        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </div>
    </>
  );
}
