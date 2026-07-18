import { useState } from "react";
import { Link2, Copy, Check, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { apiFetch, clearTokens } from "./api";
import { useNavigate } from "react-router-dom";

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function LinkRow({ link }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(link.short).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="min-w-0">
        <a
          href={link.short}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-neutral-900 hover:underline flex items-center gap-1"
        >
          {link.short.replace(/^https?:\/\//, "")}
          <ExternalLink size={12} className="text-neutral-400 shrink-0" />
        </a>
        <p className="text-xs text-neutral-400 truncate">{link.original}</p>
      </div>
      <button
        onClick={copy}
        className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
      >
        {copied ? (
          <>
            <Check size={13} className="text-emerald-500" />
            Copied
          </>
        ) : (
          <>
            <Copy size={13} />
            Copy
          </>
        )}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);

  async function handleShorten(ev) {
    ev.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Paste a URL first");
      return;
    }
    if (!isValidUrl(url.trim())) {
      setError("That doesn't look like a valid URL");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch("/url/shorten", {
        method: "POST",
        body: JSON.stringify({ original_url: url.trim() }),
      });

      setLinks((prev) => [
        { short: data.short_url, original: url.trim() },
        ...prev,
      ]);
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearTokens();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-900">
            <Link2 size={18} />
            <span className="font-mono text-sm tracking-wide">dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-neutral-900">Shorten a URL</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Paste a long link and get a short one back.
        </p>

        <form onSubmit={handleShorten} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/a/very/long/path"
              className={`w-full px-4 py-2.5 rounded-md border text-sm bg-white text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 ${
                error ? "border-red-400" : "border-neutral-200"
              }`}
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Shortening
              </>
            ) : (
              "Shorten"
            )}
          </button>
        </form>

        {links.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-400 mb-1">
              Your links
            </h2>
            <div className="bg-white rounded-lg border border-neutral-200 px-4">
              {links.map((link, i) => (
                <LinkRow key={i} link={link} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}