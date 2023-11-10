import jwt from 'jsonwebtoken';
import logger from '~/config/logger';

export const sign = (payload: { user_id: string }, expiresIn: string, secret: string) => {
   return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn }, (err, token) => {
         if (err) {
            logger.error(err)
            reject(err)
         }
         else resolve(token)
      })
   })
}
export const verify = (token: string, secret: string) => {
   return new Promise((resolve, rejcect) => {
      jwt.verify(token, secret, (err, decoded) => {
         if (err) {
            logger.error(err)
            rejcect(err);
         }
         else resolve(decoded)
      })
   })
}