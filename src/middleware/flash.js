const flashMessages = (req, res, next) => {
  // Make flash messages available to views
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  res.locals.errors = req.session.errors || [];

  // Hook into res.redirect to preserve flash messages for one more request
  const originalRedirect = res.redirect.bind(res);
  res.redirect = function(status, url) {
    // Handle both redirect(url) and redirect(status, url) signatures
    if (typeof status === 'string') {
      url = status;
    }
    // Don't clear messages - let them persist for the next request
    return originalRedirect(url);
  };

  // Clear messages after rendering (for non-redirect responses)
  const originalRender = res.render.bind(res);
  res.render = function(view, options, callback) {
    // Clear messages from session after rendering
    delete req.session.success;
    delete req.session.error;
    delete req.session.errors;
    return originalRender(view, options, callback);
  };

  next();
};

export default flashMessages;
