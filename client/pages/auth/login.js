import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, error } = useRequest({
    url: '/api/users/login',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Login</h1>

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
      {error}

      {/* Submit Button */}
      <button className='btn btn-primary'>Login</button>
    </form>
  );
};

export default Login;
