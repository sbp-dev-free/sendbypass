export const getStatusColor = (status: string) => {
  switch (status) {
    case 'SUBMITTED':
      return 'blue';
    case 'ACCEPTED':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'PAYED':
      return 'geekblue';
    case 'DELIVERED':
      return 'gold';
    case 'REJECTED':
      return 'red';
    case 'CANCELED':
      return 'magenta';
    case 'FINISHED':
      return 'lime';
    case 'EXPIRED':
      return 'volcano';
    default:
      return 'default';
  }
};
