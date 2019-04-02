import * as redis from 'redis'

const redisCli = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
})

const getKey = (key): Promise<string | false> =>
  new Promise((resolve, reject) => {
    redisCli.get(key, (error, reply) => {
      if (error) {
        reject(error)
      }
      if (reply) {
        resolve(reply)
      } else {
        resolve(false)
      }
    })
  })

const setKey = (key, val) =>
  new Promise((resolve, reject) => {
    redisCli.set(key, val, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })

const deleteKey = (key: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    redisCli.del(key, (error, n) => {
      if (error) {
        reject(error)
      } else {
        resolve(n === 1)
      }
    })
  })

export const addSession = async (uid: string, details: string) => {
  const session =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  await setKey(`session-${session}`, uid)
  return session
}

export const getIdFromSession = async (
  session: string,
): Promise<string | false> => getKey(`session-${session}`)

export const getAllUSersSessions = async (uid: string) => {}

export const deleteSession = async (session: string): Promise<boolean> =>
  deleteKey(`session-${session}`)
