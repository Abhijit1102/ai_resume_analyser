import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume@AI" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value) as Resume);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main className="relative bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      {/* Floating Wipe Data Button (visible when resumes exist) */}
      {!loadingResumes && resumes.length > 0 && (
        <Link
          to="/wipe"
          className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-red-700 transition duration-200"
        >
          🧹 Wipe App Data
        </Link>
      )}

      <section className="main-section">
        <div className="page-heading py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-md">
            Track Your Applications & Resume Ratings
          </h1>

          {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="text-lg text-gray-700 mt-3">
              No resumes found. Upload your first resume to get feedback.
            </h2>
          ) : (
            <h2 className="text-lg text-gray-700 mt-3">
              Review your submissions and check AI-powered feedback.
            </h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-10">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading resumes..." />
            <p className="text-gray-600 mt-3">Fetching your resumes...</p>
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section grid gap-6 px-10 pb-20 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Upload & Wipe Buttons when no resumes exist */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              📤 Upload Resume
            </Link>
            <Link
              to="/wipe"
              className="secondary-button w-fit text-lg font-semibold text-red-600 border border-red-600 px-5 py-2 rounded-md hover:bg-red-50 transition"
            >
              🧹 Wipe App Data
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
