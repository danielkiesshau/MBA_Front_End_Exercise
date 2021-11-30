import jwt, { JwtPayload } from 'jsonwebtoken'
import type { NextApiRequest, NextApiHandler, NextApiResponse } from 'next'

export const jwtValidator = (handler: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {

  const {
    SECRET_KEY
  } = process.env;

  if (!SECRET_KEY)
    return res.status(500).json({ error: 'ENV SECRET KEY não informada' })

  const noAuthorization = !req || !req.headers || !req.headers.authorization;

  if (noAuthorization)
    return res.status(400).json({ error: 'Não foi possível validar token de segurança' })

    const isOptionsMethod = req.method === 'OPTIONS';

    if (!isOptionsMethod) {
      const authorization = req.headers.authorization;

      const token = authorization?.substr(7);

      if (!token)
        return res.status(400).json({ error: 'Token de segurança não foi informado' })
      
        const decode = await jwt.verify(token, SECRET_KEY) as JwtPayload;

        if (!decode)
          return res.status(400).json({ error: 'Token de segurança inválido' })

        if (req.body) {
          req.body.userId = decode._id;
        } else if (req.query) {
          req.query.userId = decode._id;
        }
    }
  } catch (err) {
    return res.status(500).json(err)
  }

  return handler(req,res)
}
