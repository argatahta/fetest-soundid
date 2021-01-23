
import { useState } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import AuthAPI from "../api/auth";

export default function Home() {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false)

  const onChange = (e) => {
    const { value, name } = e.target;
    if (name == "username") setUsername(value);
    if (name == "password") setPassword(value);
  }

  const handleSubmitLogin = async () => {
    setError("");
    setLoading(true)
    try {
      const result = await AuthAPI.userLogin(username, password);
      if (result.data) {
        const decodedJwt = jwt_decode(result.data)
        localStorage.setItem("_at", result.data);
        localStorage.setItem("user_data", JSON.stringify(decodedJwt))
        router.push("/message");
      }
      setLoading(false);
      console.log("Client login success", result)
    } catch (error) {
      setError(error ?? "Error");
      setLoading(false);
      console.log("Client login error", error);
    }
  }
  return (
    <div className="container mx-auto min-h-screen min-w-full sm:flex sm:flex-col">

      <div className="sticky bg-wa-light text-white px-4 py-4 font-bold flex flex-row justify-between sm:justify-center">
        {/* NAVBAR DESKTOP SECTION */}
        <div className="hidden space-x-10 sm:flex flex-row">
          <a href="#" className=" text-white block text-base font-medium">Home</a>
          <a href="#" className=" text-white block text-base font-medium">Profile</a>
          <a href="#" className=" text-white block text-base font-medium">Sign in</a>
          <a href="#" className=" text-white block text-base font-medium">Referal</a>
          <a href="#" className=" text-white block text-base font-medium">Home</a>
          <svg className="h-4 w-4 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* NAVBAR MOBILE SECTION */}
        {isMobileNavbarOpen ? (
          <button onClick={() => setIsMobileNavbarOpen(false)} className="sm:hidden focus:outline-none" >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
            <button onClick={() => setIsMobileNavbarOpen(true)} className="sm:hidden focus:outline-none" >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          )}

        <svg className="sm:hidden h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className={`${isMobileNavbarOpen ? "block" : "hidden"} absolute sm:hidden bg-white`}>
        <div className="px-5 pt-4 pb-3 space-y-1">
          <a href="#" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Social</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign in</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Referal</a>
        </div>
      </div>

      <div className="px-4 sm:flex sm:flex-col sm:justify-center sm:m-auto sm:max-w-3xl">
        <div className="sm:flex sm:flex-row sm:justify-center sm:m-auto ">
          <img className="sm:flex sm:h-64 sm:w-6/12 sm:self-center rounded-lg mt-8 sm:mt-0 sm:justify-center sm:mr-10" src={"https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"} />

          <div className="sm:flex sm:flex-col sm:justify-center sm:max-w-sm">
            <h1 className="font-bold opacity-70 text-3xl leading-snug mt-5 "> Simple. Secure.</h1>
            <h1 className="font-bold opacity-70 text-3xl leading-snug"> Reliable messaging.</h1>
            <p className="my-5 opacity-30">With WhatsUp, you’ll get fast, simple, secure messaging and calling for free, available on phones all over the world.</p>

            <div className="sm:hidden border border-gray-200 my-5 rounded sm:mt-0" />
            <form className="sm:hidden flex flex-col w-full ">
              <input
                type='text'
                id="username"
                name="username"
                placeholder="Username"
                className="mt-1 rounded p-4 outline-none border border-gray-200 mb-2"
                // value={username}
                onChange={onChange}
              />
              <input
                type='password'
                id="password"
                name="password"
                placeholder="Password"
                className="mt-1 rounded p-4 outline-none border border-gray-200"
                // value={password}
                onChange={onChange}
              />
              <div className="mt-3 text-red-500 text-xs flex justify-end">
                {error}
              </div>

              {loading ? (
                <div className="bg-wa-light rounded text-white my-3 p-3 focus:outline-none text-center">
                  Loading...
                </div>
              ) : (
                  <button type="button"
                    onClick={handleSubmitLogin}
                    className="bg-wa-light rounded text-white my-3 p-3 focus:outline-none"
                    disabled={!username && !password}
                  >
                    Login
                  </button>
                )}

            </form>
          </div>
        </div>
        <div className="hidden sm:block border border-gray-200 my-5 sm:my-10 rounded" />

        <div className="hidden px-4 sm:flex sm:flex-row sm:justify-between">
          <div className="flex flex-col w-6/12 mr-10">
            <h1 className="font-bold opacity-70 text-3xl leading-snug mt-5 "> Login and get</h1>
            <h1 className="font-bold opacity-70 text-3xl leading-snug"> connected now!</h1>
          </div>
          
          <div className="sm:flex sm:flex-col w-6/12  ">
            <form className="flex flex-col w-full ">
              <input
                type='text'
                id="username"
                name="username"
                placeholder="Username"
                className="mt-1 rounded p-4 outline-none border border-gray-200 mb-2"
                // value={username}
                onChange={onChange}
              />
              <input
                type='password'
                id="password"
                name="password"
                placeholder="Password"
                className="mt-1 rounded p-4 outline-none border border-gray-200"
                // value={password}
                onChange={onChange}
              />
              <div className="mt-3 text-red-500 text-xs flex justify-end">
                {error}
              </div>

              {loading ? (
                <div className="bg-wa-light rounded text-white my-3 p-3 focus:outline-none text-center">
                  Loading...
                </div>
              ) : (
                  <button type="button"
                    onClick={handleSubmitLogin}
                    className="bg-wa-light rounded text-white my-3 p-3 focus:outline-none"
                    disabled={!username && !password}
                  >
                    Login
                  </button>
                )}

            </form>
          </div>
        </div>
      </div>

    </div>
  )
}
