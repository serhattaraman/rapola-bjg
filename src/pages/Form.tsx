
import React from 'react';

const Form = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in form-page">
      <div className="max-w-7xl mx-auto form-container">
        <div className="mb-8 form-header">
          <h1 className="text-3xl font-bold">Form</h1>
          <p className="text-gray-500 mt-1">Lütfen formu doldurunuz</p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Ortalama Tecrübe</h3>
            <p className="text-2xl font-semibold text-gray-900">4.5 Yıl</p>
            <p className="text-sm text-gray-600 mt-1">Başvuranların ortalama tecrübesi</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 form-embed-container">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSdbgNHegxyM4iXTl_GbE-JKeBFaiH6L-mTnXPLJTFH-0ZjIow/viewform?embedded=true" 
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
