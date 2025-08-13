const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const URLS: Record<string, (...params: string[]) => string> = {
  login: () => `${apiUrl}/v1/login/`,
  googleLogin: () => `${apiUrl}/v1/google_login/`,
  googleRedirect: () => `${apiUrl}/v1/google_login/redirect`,
  register: () => `${apiUrl}/v1/users/`,
  refresh: () => `${apiUrl}/v1/login/refresh/`,
  forgotPassword: () => `${apiUrl}/v1/account_requests/`,
  resetPassword: (uid, token) =>
    `${apiUrl}/v1/account_request/${uid}/${token}/`,
  requirements: () => `${apiUrl}/v1/requirements/`,
  requirement: (id) => `${apiUrl}/v1/requirements/${id}/`,
  editRequirement: (id) => `${apiUrl}/v1/requirements/${id}/`,
  locations: () => `${apiUrl}/v1/locations/`,
  profile: () => `${apiUrl}/v1/profile/`,
  trips: () => `${apiUrl}/v1/trips/`,
  trip: (id) => `${apiUrl}/v1/trips/${id}/`,
  services: () => `${apiUrl}/v1/services/`,
  editService: (id) => `${apiUrl}/v1/services/${id}/`,
  requests: () => `${apiUrl}/v1/requests/`,
  editRequest: (id) => `${apiUrl}/v1/requests/${id}/`,
  orders: () => `${apiUrl}/v1/orders/`,
  orderSteps: (id) => `${apiUrl}/v1/order_steps/${id}/`,
  editOrderStep: (id) => `${apiUrl}/v1/order_steps/${id}/`,
  verifyEmail: (id, token) => `${apiUrl}/v1/user_documents/${id}/${token}/`,
  cities: (country) =>
    `${apiUrl}/v1/cities${Boolean(country) ? `?country=${country}` : ''}`,
  countries: () => `${apiUrl}/v1/countries/`,
  socials: () => `${apiUrl}/v1/socials/`,
  social: (id) => `${apiUrl}/v1/socials/${id}/`,
  userLocations: () => `${apiUrl}/v1/user_locations/`,
  userLocation: (id) => `${apiUrl}/v1/user_locations/${id}/`,
  airports: () => `${apiUrl}/v1/airports/`,
  languages: () => `${apiUrl}/v1/languages/`,
  tickets: () => `${apiUrl}/v1/tickets/`,
  deleteAccount: () => `${apiUrl}/v1/user/`,
  subscribe: () => `${apiUrl}/v1/subscribes/`,
};

export default URLS;
