import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, error } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'),
  });

  const submitHandler = (e) => {
    e.preventDefault();

    doRequest();
  };

  // Sanitize price input
  const onBlur = () => {
    const value = parseFloat(price);

    // If price input is not a number, return immediately
    if (isNaN(value)) {
      return;
    }

    // else call setPrice
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Error Message */}
        {error}

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
