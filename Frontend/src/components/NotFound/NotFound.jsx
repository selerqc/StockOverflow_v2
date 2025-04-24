import React from "react";
import "../NotFound/NotFound.css";
import { Link } from "react-router-dom";
function NotFound() {
  return (
    <section className='nfp-section'>
      <div className='nfp-container'>
        <div className='nfp-error-content'>
          <h2 className='nfp-error-code'>
            <span className='nfp-sr-only'>Error</span>404
          </h2>
          <p className='nfp-error-title'>Sorry, we couldn't find this page.</p>
          <p className='nfp-error-message'>
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to='/login' className='nfp-home-button'>
            Back to Login Page
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
