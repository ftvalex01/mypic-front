import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
const SocialLogin = ({ provider }) => {
    const handleLogin = () => {
        window.location.href = `http://localhost:8000/auth/redirect/${provider}`;
    };

    return (
        <button onClick={handleLogin} className="btn btn-outline-primary pt-2">
            {provider === 'github' && <FontAwesomeIcon icon={faGithub} />}
            {provider === 'google' && <FontAwesomeIcon icon={faGoogle} />}
            {` Log in with ${provider}`}
        </button>
    );
};

export default SocialLogin