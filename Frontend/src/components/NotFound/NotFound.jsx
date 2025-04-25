import React from "react";
import "../NotFound/NotFound.css";
import { Link } from "react-router-dom";
import { useToken } from "../../hooks/TokenContext";
function NotFound() {
  const { setToken } = useToken();
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
          <button
            className='nfp-home-button'
            onClick={() => {
              setToken(null);
              sessionStorage.removeItem("user");
              sessionStorage.removeItem("role");

              window.location.href = "/login";
            }}>
            Back to Login Page
          </button>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
