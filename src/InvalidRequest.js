/**
 * A custom error class used for when an unexpected RequestType is used. The
 * constructor modifies the stack trace to remove the call to this error's
 * constructor.
 */
class InvalidRequestType extends TypeError {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InvalidRequestType);
  }
}

module.exports = InvalidRequestType;
