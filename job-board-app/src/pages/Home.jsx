import React from 'react';
import ResumeUpload from '../components/ResumeUpload';

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-sky-100 to-blue-200 min-h-screen flex items-center justify-center p-4">
      <ResumeUpload />
      <PopularKeywords />

    </div>
  );
}
