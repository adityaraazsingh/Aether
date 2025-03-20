"use client";
import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";



export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  

  
  return (
    <div className="h-screen flex items-center justify-center bg-[#5C3B58] text-white text-2xl">
      <div className=" ">
        {state == "signIn" ? <SignInCard setState={setState}/> : <SignUpCard setState={setState} />}
        
      </div>
    </div>
  );
};
