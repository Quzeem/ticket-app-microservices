export const natsWrapper = {
  client: {
    // Brought in jest mock function to write assertions in our test cases that publish method is actually being invoked
    // mockImplementation is optional but in our case, we still need the custom implementation for publish method
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          // The callback function needs to be invoked for the publisher to think that everything went well
          callback();
        }
      ),
  },
};
