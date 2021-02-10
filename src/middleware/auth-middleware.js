import * as jwt from 'jsonwebtoken';

// requireAuth funkcija se pridaje svakoj ruti koju zelimo zastiti i sluzi za provjeru
// tokena. Ukoliko korisnik nije poslao token, bacamo error
// primjenu mozemo vidjet u main-router fileu
export function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).end();

  // inace provjeravamo je li token validan, ukoliko nije ponovo bacamo error, a inace pustamo
  // korisnika dalje pozivom metode next.
  return jwt.verify(token, 'secret', (err) => {
    if (err) {
      return res.status(401).end();
    }
    return next();
  });
}

