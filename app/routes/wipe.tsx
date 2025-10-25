import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";

interface FSItem {
  id: string;
  name: string;
  path: string;
}

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const loadFiles = async () => {
    try {
      const result = (await fs.readDir("./")) as FSItem[];
      setFiles(result);
    } catch (err) {
      console.error("Failed to load files:", err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setDeleting(true);
    setMessage("Deleting all app data...");
    try {
      for (const file of files) {
        await fs.delete(file.path);
      }
      await kv.flush();
      setMessage("All app data wiped successfully ✅");
      await loadFiles();
    } catch (err) {
      console.error("Error deleting files:", err);
      setMessage("Error while deleting files ❌");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        Loading your workspace...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
        <button
          onClick={clearError}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      {/* Navbar for visual consistency */}
      <Navbar />

      <section className="main-section py-16 flex flex-col items-center">
        <div className="page-heading text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-md">
            🧹 Wipe App Data
          </h1>
          <p className="text-gray-700 mt-3">
            Authenticated as{" "}
            <span className="text-blue-600 font-semibold">
              {auth.user?.username}
            </span>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-8 w-[90%] max-w-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Existing Files
          </h2>

          {files.length > 0 ? (
            <div className="space-y-3 mb-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition p-3 rounded-md"
                >
                  <p className="truncate text-gray-800 font-medium">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic mb-6">No files found 🎉</p>
          )}

          {message && (
            <div
              className={`text-center mb-6 font-medium ${
                message.includes("✅")
                  ? "text-green-600"
                  : message.includes("❌")
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              disabled={deleting || files.length === 0}
              className={`px-6 py-2 rounded-md font-semibold transition duration-200 ${
                deleting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {deleting ? "Wiping..." : "Wipe App Data"}
            </button>

            <Link
              to="/"
              className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              ⬅ Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WipeApp;
