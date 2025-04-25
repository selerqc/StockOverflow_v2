import React from "react";
import "../NotFound/NotFound.css";
import { Link } from "react-router-dom";
function ForbiddenPage() {
  return (
    <section className='nfp-section'>
      <div className='nfp-container'>
        <div className='nfp-error-content'>
          <h2 className='nfp-error-code'>
            <span className='nfp-sr-only'>Error</span>403
          </h2>
          <p className='nfp-error-title'>Access Not Granted</p>
          <p className='nfp-error-message'>
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to='/dashboard' className='nfp-home-button'>
            Back to Dashboard Page
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForbiddenPage;
