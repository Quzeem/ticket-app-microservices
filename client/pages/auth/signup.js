import { useState } from 'react';
// import axios from 'axios';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState({});
  const { doRequest, error } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    // try {
    //   await axios.post('/api/users/signup', { email, password });
    //   Router.push('/')
    // } catch (err) {
    //   setError(err.response.data);
    // }
    await doRequest();
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Sign Up</h1>

      {/* Email */}
      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='form-control'
        />
      </div>

      {/* Password */}
      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
      </div>

      {/* Error Message */}
      {/* {error.message && (
        <div className='alert alert-danger'>{error.message}</div>
      )} */}
      {error}

      {/* Submit Button */}
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};

export default Signup;
