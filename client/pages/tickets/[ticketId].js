import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const ViewTicketDetails = ({ ticket }) => {
  const { doRequest, error } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      {/* Error Message */}
      {error}
      <button onClick={(e) => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

ViewTicketDetails.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const {
    data: { data: ticket },
  } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket };
};

export default ViewTicketDetails;
