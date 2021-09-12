import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const ViewOrderDetails = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, error } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders'),
  });

  // Ensures the calculation is done once when the page loads
  useEffect(() => {
    const findTimeLeft = () => {
      // Calculate number of seconds left before the order expires
      const msLeft = new Date(order.expiresAt) - new Date();
      const secLeft = msLeft / 1000;
      setTimeLeft(Math.round(secLeft));
    };

    // Invoke findTimeLeft immediately the page loads
    findTimeLeft();
    // Then call findTimeLeft every 1s
    const timerId = setInterval(findTimeLeft, 1000);

    // Stop setInterval as soon as we navigate away from this component. NB: A function returned from the useEffect of a component will be invoked if we are about to navigate away from the component or if the component is going to be re-rendered(based on the dependencies listed in its array)
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order has expired</div>;
  }

  return (
    <div>
      <p>Time left to purchase order: {timeLeft} seconds</p>
      {error}
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_FlLFVapGHTly3FicMdTU06SC006tWtWbNH" // Extract to a helper file/env var/K8s secret
        amount={order.ticket.price * 100} // Stripe treats an amount as a cent
        email={currentUser.email}
      />
    </div>
  );
};

ViewOrderDetails.getIntialProps = async (context, client) => {
  const { orderId } = context.query;
  const {
    data: { data: order },
  } = await client.get(`/api/orders/${orderId}`);

  return { order };
};

export default ViewOrderDetails;
