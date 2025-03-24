
import React from 'react';

const Form = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in form-page">
      <div className="max-w-7xl mx-auto form-container">
        <div className="mb-8 form-header">
          <h1 className="text-3xl font-bold">Form</h1>
          <p className="text-gray-500 mt-1">Lütfen formu doldurunuz</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 form-embed-container">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSfuk2ecTtuLrTZn2sUqmxykIVOjXvbemZGIH4oIwymZSzYXCA/viewform?embedded=true" 
            width="100%" 
            height="4645" 
            className="border-none" 
            title="Google Form">
            Yükleniyor…
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Form;
