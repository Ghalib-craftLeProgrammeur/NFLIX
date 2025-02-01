import Input from "@/components/input";
import axios from "axios";
import { useCallback, useState } from "react";

/* eslint-disable @next/next/no-img-element */
const Auth = () => {
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const [variant,setVariant] = useState("login");

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => (currentVariant === "login" ? "register" : "login"));
    }, []);

    const register = useCallback(async () => {
      try {
        await axios.post('/api/register', {
          email,
          name,
          password
        })
      } catch(error) {
        console.log(error)
      }
    }, []);
    
  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="logo" className="h-20"></img>
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
                {variant === "login"? 'Sign In': "Register"}
                </h2>
            <div className="flex flex-col gap-4">
                {variant === "register" && (
     <Input 
    label="Username"
    onChange={(ev) => {setUsername(ev.target.value)}}
    id="name"
    value={username}
    />
        )}
                <Input 
                label="Email"
                onChange={(ev) => {setEmail(ev.target.value)}}
                id="email"
                type="email"
                value={email}
                />
                 <Input 
                label="Password"
                onChange={(ev) => {setPassword(ev.target.value)}}
                id="password"
                type="password"
                value={password}
                />
            </div>
            <button className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
               {variant === "login" ? "Login": "Sign up"}
            </button>
            <p className="text-neutral-500 mt-12">
              {variant === "login" ? "First time using Netflix?": "Already have an account?"}  
                <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                 {variant === "login" ? "Create an account": "Login"}
                </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
