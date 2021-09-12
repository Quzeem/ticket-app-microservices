import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [error, setError] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setError(null); // Clears previously displayed error
      const response = await axios[method](url, { ...body, ...props });
      // Redirect to homepage on success
      if (onSuccess) {
        onSuccess(response.data.data);
      }
      return response.data.data;
    } catch (err) {
      // Set error as JSX element
      setError(
        <div className="alert alert-danger">{err.response.data.message}</div>
      );
    }
  };

  return { doRequest, error };
};

export default useRequest;
