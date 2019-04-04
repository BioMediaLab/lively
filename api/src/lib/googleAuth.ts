import { google } from 'googleapis'

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]

const getGoogleApiClient = () => {
  const oClient = new google.auth.OAuth2(
    process.env.GOOGLE_APP_CLIENT_ID,
    process.env.GOOGLE_APP_SECRET,
    process.env.GOOGLE_APP_REDIRECT_URL,
  )
  google.options({ auth: oClient })
  return oClient
}

export const getRedirectUrl = () =>
  getGoogleApiClient().generateAuthUrl({
    access_type: 'online',
    scope: scopes,
  })

export const setCredentialsFromCode = async (code: string) => {
  const oauth2Client = getGoogleApiClient()
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  google.options({ auth: oauth2Client })
}

export const getProfileData = async () => {
  const { data } = await google
    .oauth2({
      version: 'v2',
    })
    .userinfo.get()
  return data
}
