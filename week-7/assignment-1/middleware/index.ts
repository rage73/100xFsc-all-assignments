import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.userId = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export {
  authenticateJwt,
  SECRET
}
