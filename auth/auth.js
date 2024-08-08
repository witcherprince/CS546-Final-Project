const authMiddleware = (req, res, next) => {
    const timeStamp = new Date().toUTCString();
    const reqMethod = req.method;
    const reqRoute = req.originalUrl;
    
    const userAuthenticated = req.session.daycare ? 'Authenticated User' : 'Non-Authenticated User';
  
    console.log(`[${timeStamp}]: ${reqMethod} ${reqRoute} (${userAuthenticated})`);
  
    if (req.session.daycare) {
      if (req.session.daycare.role === 'daycare') {
        return next(); 
      } else {
        return res.status(403).render('daycares/error', { error: 'You do not have the required permissions.' });
      }
    } else {
      return res.redirect('daycares/login'); 
    }
  };
  
export default authMiddleware;