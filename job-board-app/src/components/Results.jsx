import React, { useState, useEffect, useMemo, useCallback } from "react";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function Results() {
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    company: "",
    sortBy: "",
    order: "asc",
    page: 1,
  });

  const limit = 10;
  const debouncedTitle = useDebounce(filters.title, 500);
  const debouncedLocation = useDebounce(filters.location, 500);
  const debouncedCompany = useDebounce(filters.company, 500);

  const apiUrl = "https://hirebuddy-project-assingment-3.onrender.com/api/jobs";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedTitle) params.append("title", debouncedTitle);
    if (debouncedLocation) params.append("location", debouncedLocation);
    if (debouncedCompany) params.append("company", debouncedCompany);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    params.append("order", filters.order);
    params.append("page", filters.page);
    params.append("limit", limit);
    return params.toString();
  }, [debouncedTitle, debouncedLocation, debouncedCompany, filters, limit]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}?${queryString}`);
        const data = await res.json();
        setJobs(data.jobs ?? []);
        setTotalJobs(data.total ?? 0);
      } catch (err) {
        console.error("Fetch failed:", err);
        setJobs([]);
        setTotalJobs(0);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [queryString]);

  const totalPages = useMemo(() => Math.ceil(totalJobs / limit) || 1, [totalJobs]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  }, []);

  const changePage = useCallback(
    (direction) => {
      setFilters((prev) => ({
        ...prev,
        page: Math.max(1, Math.min(totalPages, prev.page + direction)),
      }));
    },
    [totalPages]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedJob(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          selectedJob
            ? "filter blur-lg pointer-events-none select-none"
            : "filter blur-0 pointer-events-auto select-auto"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 drop-shadow-md">
            Explore Opportunities
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-block px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Upload Your Resume
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto gap-3">
              <input
                type="text"
                value={filters.title}
                onChange={(e) => updateFilter("title", e.target.value)}
                placeholder="Search by title"
                className="flex-grow p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                placeholder="Filter by location"
                className="flex-grow p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <input
                type="text"
                value={filters.company}
                onChange={(e) => updateFilter("company", e.target.value)}
                placeholder="Filter by company"
                className="flex-grow p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="w-full sm:w-auto p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="">Sort by</option>
                <option value="job_title">Title</option>
                <option value="job_location">Location</option>
                <option value="company_name">Company</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 text-lg mt-6">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-6">No jobs found.</p>
          ) : null}

          <ul className="space-y-6">
            {jobs.map((job, idx) => (
              <li
              key={job.id || `${job.job_title}-${job.company_name}-${idx}`}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-indigo-400/40 transition cursor-pointer"
              tabIndex={0}
              onClick={() => setSelectedJob(job)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSelectedJob(job);
              }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Left Side */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-1 truncate">
                    {job.job_title || "Untitled Position"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 truncate">{job.company_name || "Unknown Company"}</p>
                  <p className="text-sm text-gray-700 mb-2 truncate">
                    {job.job_description || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>📍 {job.job_location || "Remote"}</span>
                    <span>📅 {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
            
                {/* Right Side */}
                <div className="shrink-0 self-start md:self-center">
                  {job.apply_link ? (
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Apply Now
                    </a>
                  ) : (
                    <div className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl select-none">
                      No Apply Link
                    </div>
                  )}
                </div>
              </div>
            </li>
            ))}
          </ul>

          <div className="flex justify-center items-center gap-6 mt-12 flex-wrap">
            <button
              onClick={() => changePage(-1)}
              disabled={filters.page === 1}
              className={`px-5 py-2 rounded-full border transition font-semibold ${
                filters.page === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-indigo-700 border-indigo-500 hover:bg-indigo-100"
              }`}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <span className="text-indigo-700 font-semibold text-lg select-none">
              Page {filters.page} of {totalPages}
            </span>
            <button
              onClick={() => changePage(1)}
              disabled={filters.page === totalPages}
              className={`px-5 py-2 rounded-full border transition font-semibold ${
                filters.page === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-indigo-700 border-indigo-500 hover:bg-indigo-100"
              }`}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setSelectedJob(null)}
          ></div>

          <div
            className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl transform transition-transform duration-300 animate-scaleFadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedJob(null)}
              aria-label="Close job description"
              className="absolute top-4 right-4 text-gray-600 hover:text-indigo-600 text-4xl font-bold transition-colors duration-300 focus:outline-none"
            >
              &times;
            </button>

            <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">
              {selectedJob.job_title || "Untitled Position"}
            </h2>
            <p className="text-lg text-gray-700 mb-2 font-semibold">{selectedJob.company_name || "Unknown Company"}</p>
            <p className="text-gray-600 mb-4">
              Location: {selectedJob.job_location || "Remote"} | Posted:{" "}
              {selectedJob.posted_date
                ? new Date(selectedJob.posted_date).toLocaleDateString()
                : "N/A"}
            </p>
            <hr className="border-indigo-200 mb-6" />
            <div className="text-gray-800 whitespace-pre-line leading-relaxed">
              {selectedJob.job_description || "No detailed description available."}
            </div>
            {selectedJob.apply_link && (
              <a
                href={selectedJob.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tailwind CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-scaleFadeIn {
          animation: scaleFadeIn 0.3s ease forwards;
        }
      `}</style>
    </>
  );
}
