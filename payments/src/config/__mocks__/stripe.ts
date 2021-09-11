// The expectation is that when we call the create method, we are going to get back a promise that we await to resolve. Thus, the reason for using mockResolvedValue() - returns a promise immediately that automatically resolves itself to {}
// export const stripe = {
//   charges: {
//     create: jest.fn().mockResolvedValue({}),
//   },
// };
