import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'
import cookieParser from 'cookie-parser'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

export default polka()
  .use(cookieParser())
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware({
      session: async (req) => {
        if(!req.cookies.user)
          return {}

        const user = JSON.parse(req.cookies.user)
        return { user }
      } 
    })
  )
  .listen(PORT, err => {
    if (err) console.log('error', err)
  })
