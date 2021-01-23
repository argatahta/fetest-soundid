// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AuthAPI from "../../api/auth";
// import cookies from 'utils/cookies';

const handler = async (req, res) => {
  const password = req.query.password;
  const username = req.query.username;
  try {
    const loginResult = await AuthAPI.serverLogin(username, password)
    const accessToken = loginResult?.data?.data?.access_token ?? ""
    res.send(accessToken)
  } catch (error) {
    console.log("SERVER LOGIN ERROR", error)
    const status = error.statusCode || 400
    res.status(status).send(error.error_message)
  }
}

export default handler
