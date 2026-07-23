import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { resetPassword } from "./api";

function Field({ icon: Icon, error, rightSlot, ...props }) {
  return (
    <div>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          {...props}
          className={`w-full pl-9 pr-9 py-2.5 rounded-md border text-sm bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:bg-white focus:border-neutral-900 ${
            error ? "border-red-400" : "border-neutral-200"
          }`}
        />
        {rightSlot}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const e = {};
    if (!password || password.length < 6) e.password = "Use at least 6 characters";
    if (confirm !== password) e.confirm = "Passwords don't match";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setSubmitError("");
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      await resetPassword({ token, new_password: password });
      setDone(true);
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm text-center">
          <p className="text-sm text-neutral-600">
            This reset link is invalid or missing a token.
          </p>
          <Link
            to="/forgot-password"
            className="mt-3 inline-block text-sm text-neutral-900 font-medium underline underline-offset-2"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-neutral-900">
            Set a new password
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Make it something you'll remember.
          </p>

          {done ? (
            <div className="mt-6 flex items-center gap-2 p-4 rounded-md bg-neutral-50 border border-neutral-200">
              <CheckCircle2 size={18} className="text-amber-500 shrink-0" />
              <p className="text-sm text-neutral-600">
                Password updated. Redirecting to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <Field
                icon={Lock}
                type={showPw ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <Field
                icon={Lock}
                type={showPw ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
              />

              {submitError && (
                <p className="text-sm text-red-500 -mt-1">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Updating..." : (
                  <>
                    Reset password
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}