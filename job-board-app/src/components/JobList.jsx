import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        params: {
          title: searchTitle,
          location,
          company,
          sortBy,
          order,
          page,
          limit
        }
      });
      setJobs(res.data.jobs);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTitle, location, company, sortBy, order, page]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Job Listings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input
          className="p-2 border"
          placeholder="Search by title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          className="p-2 border"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className="p-2 border"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <select className="p-2 border" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort by Title</option>
          <option value="company">Sort by Company</option>
        </select>
        <select className="p-2 border" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <ul className="space-y-2">
        {jobs.map((job, index) => (
          <li key={index} className="border p-4 rounded">
            <h2 className="font-bold text-lg">{job.title}</h2>
            <p className="text-sm">{job.company} — {job.location}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <button
          className="p-2 border rounded"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="p-2">Page {page} of {totalPages}</span>
        <button
          className="p-2 border rounded"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobList;
