import { useState, useEffect } from "react";
import { Login } from "../containers/Login";
import { Home } from "../containers/Home";
import { User } from "../containers/User";

export default function Index() {

  const [token, setToken] = useState<string | null>('');
  const [user, setUser] = useState<string | null>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const at = localStorage.getItem('accessToken');
      setToken(at);
      setUser(user);
    }
  }, []);

  return token ? <Home setToken={setToken} setUser={setUser}/> : user ? <User setToken={setToken} setUser={setUser}/> : <Login setToken={setToken} setUser={setUser}/>;
}