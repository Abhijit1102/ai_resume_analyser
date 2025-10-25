import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch (err) {
        console.error("Error loading resume image:", err);
        setResumeUrl(null); // fallback gracefully
      }
    };
    loadResume();
  }, [fs, imagePath]);

  const displayImage =
    resumeUrl || imagePath || "/images/placeholder-resume.png"; // ✅ fallback

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header flex justify-between items-start">
        <div className="flex flex-col gap-1">
          {companyName ? (
            <h2 className="text-black font-bold break-words">
              {companyName}
              {jobTitle && (
                <h3 className="text-lg text-gray-500 break-words">
                  {jobTitle}
                </h3>
              )}
            </h2>
          ) : (
            <h2 className="text-gray-500 italic font-medium break-words">
              Untitled Resume
            </h2>
          )}
        </div>

        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000 mt-4">
        <div className="w-full h-full">
          <img
            src={displayImage}
            alt={companyName || "Resume preview"}
            className="w-full h-[300px] max-md:h-[200px] object-cover object-top rounded-md"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-resume.png";
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
