"use client"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useState , useEffect} from "react";
import { CreateChannelModal } from "@/features/Channels/components/create-channel-modal";


export const Modals =() =>{


    const [mounted , setMounted] = useState(false);
  
    useEffect(()=>{
        setMounted(true);
    },[]);

    if(!mounted) return null;

    return (
        <>
            <CreateChannelModal/>
            <CreateWorkspaceModal/>
        </>
    );
};