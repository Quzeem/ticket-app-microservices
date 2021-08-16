import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [error, setError] = useState(null);

  const doRequest = async () => {
    try {
      setError(null); // Clears previously displayed error
      const response = await axios[method](url, body);
      // Redirect to homepage on success
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      // Set error as JSX element
      setError(
        <div className='alert alert-danger'>{err.response.data.message}</div>
      );
    }
  };

  return { doRequest, error };
};

export default useRequest
