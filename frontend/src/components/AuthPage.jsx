import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "./api";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Terminal signature panel — types out a mock auth session, line by line.
// Purely decorative; swap the SESSION lines for whatever fits your product.
// ---------------------------------------------------------------------------
const SESSION = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "guest" },
  { prompt: true, text: "auth login --secure" },
  { prompt: false, text: "verifying credentials..." },
  { prompt: false, text: "access granted", success: true },
];

function TerminalPanel() {
  const [lines, setLines] = useState([""]);
  const [done, setDone] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;

    function tick() {
      const current = SESSION[lineIdx];
      if (!current) {
        setDone(true);
        return;
      }
      charIdx += 1;
      setLines((prev) => {
        const next = [...prev];
        next[lineIdx] = current.text.slice(0, charIdx);
        return next;
      });
      if (charIdx >= current.text.length) {
        lineIdx += 1;
        charIdx = 0;
        setLines((prev) => [...prev, ""]);
        timer.current = setTimeout(tick, 380);
      } else {
        timer.current = setTimeout(tick, 28);
      }
    }

    timer.current = setTimeout(tick, 500);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-neutral-950 p-12 relative overflow-hidden">
      <style>{`
        @keyframes blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        .cursor-blink { animation: blink 1s step-start infinite; }
      `}</style>

      <div>
        <h1 className="text-3xl font-mono font-semibold text-neutral-50 leading-snug">
          Ship your next
          <br />
          feature, not another
          <br />
          login screen.
        </h1>
        <p className="mt-4 text-neutral-500 text-sm max-w-sm">
          Drop-in auth screens so you can get back to the part of the app
          that actually needs you.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-black/60 font-mono text-xs overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-800 bg-neutral-900/60">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="ml-2 text-neutral-500">session</span>
        </div>
        <div className="p-4 min-h-[140px] space-y-1.5">
          {lines.map((line, i) => {
            const meta = SESSION[i];
            if (line === "" && i === lines.length - 1 && !done) {
              return (
                <div key={i} className="flex items-center gap-2 text-emerald-400">
                  <span>$</span>
                  <span className="cursor-blink w-1.5 h-3.5 bg-emerald-400 inline-block" />
                </div>
              );
            }
            if (!meta) return null;
            return (
              <div
                key={i}
                className={
                  meta.prompt
                    ? "text-emerald-400"
                    : meta.success
                    ? "text-amber-400 flex items-center gap-1.5"
                    : "text-neutral-400"
                }
              >
                {meta.prompt && <span className="mr-2">$</span>}
                {meta.success && <CheckCircle2 size={13} />}
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable field
// ---------------------------------------------------------------------------
function Field({ icon: Icon, error, ...props }) {
  return (
    <div>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          {...props}
          className={`w-full pl-9 pr-3 py-2.5 rounded-md border text-sm bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:bg-white focus:border-neutral-900 ${
            error ? "border-red-400" : "border-neutral-200"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login + Signup form
// ---------------------------------------------------------------------------
function AuthForm({ mode, onSignupDone }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(key) {
    return (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  function validate() {
    const e = {};
    if (!isLogin && !values.name.trim()) e.name = "Enter your name";
    if (!values.email.trim()) e.email = "Enter your email";
    else if (!/\S+@\S+\.\S+/.test(values.email)) e.email = "That email doesn't look right";
    if (!values.password) e.password = "Enter a password";
    else if (!isLogin && values.password.length < 8)
      e.password = "Use at least 8 characters";
    if (!isLogin && values.confirm !== values.password)
      e.confirm = "Passwords don't match";
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
      if (isLogin) {
        await login({ email: values.email, password: values.password });
        setSubmitted(true);
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        await signup({
          username: values.name,
          email: values.email,
          password: values.password,
        });
        setSubmitted(true);
        // Backend doesn't log the user in on signup, so send them to the
        // login tab once they've seen the confirmation.
        setTimeout(() => {
          setSubmitted(false);
          onSignupDone?.();
        }, 1400);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {!isLogin && (
        <Field
          icon={User}
          type="text"
          placeholder="Full name"
          value={values.name}
          onChange={update("name")}
          error={errors.name}
        />
      )}

      <Field
        icon={Mail}
        type="email"
        placeholder="Email address"
        value={values.email}
        onChange={update("email")}
        error={errors.email}
      />

      <div className="relative">
        <Field
          icon={Lock}
          type={showPw ? "text" : "password"}
          placeholder="Password"
          value={values.password}
          onChange={update("password")}
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPw((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
          tabIndex={-1}
        >
          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {!isLogin && (
        <Field
          icon={Lock}
          type={showPw ? "text" : "password"}
          placeholder="Confirm password"
          value={values.confirm}
          onChange={update("confirm")}
          error={errors.confirm}
        />
      )}

      {isLogin && (
        <div className="flex items-center justify-between text-sm -mt-1">
          <label className="flex items-center gap-2 text-neutral-500">
            <input type="checkbox" className="rounded border-neutral-300" />
            Remember me
          </label>
          <a href="#" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
            Forgot password?
          </a>
        </div>
      )}

      {submitError && (
        <p className="text-sm text-red-500 -mt-1">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60"
      >
        {submitted ? (
          <>
            <CheckCircle2 size={16} className="text-amber-400" />
            {isLogin ? "Signed in" : "Account created"}
          </>
        ) : loading ? (
          "Please wait..."
        ) : (
          <>
            {isLogin ? "Sign in" : "Create account"}
            <ArrowRight size={15} />
          </>
        )}
      </button>

    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex bg-white">
      <TerminalPanel />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-neutral-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {isLogin
              ? "Sign in to pick up where you left off."
              : "Takes less than a minute."}
          </p>

          <div className="mt-6 relative bg-neutral-100 rounded-full p-1 flex text-sm font-medium">
            <div
              className="absolute top-1 bottom-1 w-1/2 rounded-full bg-neutral-900 transition-transform duration-300 ease-out"
              style={{ transform: isLogin ? "translateX(0%)" : "translateX(100%)" }}
            />
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`relative z-10 flex-1 py-1.5 rounded-full transition-colors ${
                isLogin ? "text-white" : "text-neutral-500"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`relative z-10 flex-1 py-1.5 rounded-full transition-colors ${
                !isLogin ? "text-white" : "text-neutral-500"
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="mt-6">
            <AuthForm key={mode} mode={mode} onSignupDone={() => setMode("login")} />
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isLogin ? "signup" : "login")}
              className="text-neutral-900 font-medium underline underline-offset-2"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}