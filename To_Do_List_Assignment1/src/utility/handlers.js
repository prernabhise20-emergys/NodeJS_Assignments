export const responseHandler = {
  constructor(status, message) {
    (this.status = status), (this.message = message);
  },
};
