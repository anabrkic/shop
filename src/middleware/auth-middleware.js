import * as jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'secret', (err) => {
      if (err) {
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
}
