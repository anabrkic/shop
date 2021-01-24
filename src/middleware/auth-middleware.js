import * as jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).end();

  return jwt.verify(token, 'secret', (err) => {
    if (err) {
      return res.status(401).end();
    }
    return next();
  });
}
