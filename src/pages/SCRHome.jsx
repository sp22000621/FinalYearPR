import React from 'react';
import SCRLayout from '../components/SCRLayout';

export default function SCRHome() {
  return (
    <SCRLayout>
      <div className="container-fluid p-4 p-md-5">
        {/* This page is currently blank as requested */}
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
          <div className="text-center py-5">
            <h6 className="text-white-50 text-uppercase fw-bold" style={{ letterSpacing: '2px', fontSize: '12px' }}>
              SCR Dashboard
            </h6>
            <p className="text-white small opacity-50">Listen...</p>
          </div>
        </div>
      </div>
    </SCRLayout>
  );
}