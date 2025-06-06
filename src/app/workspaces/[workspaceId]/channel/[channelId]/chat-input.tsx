

import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { toast } from "sonner";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { Id } from "../../../../../../convex/_generated/dataModel";


const Editor = dynamic(()=>import ("@/components/editor"),{ssr: false});

interface ChatInputProps{
    placeholder: string;
};

type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId : Id<"workspaces">
    body: string;
    image: Id<"_storage"> |undefined;
};


export const ChatInput=({placeholder}:ChatInputProps)=>{

    const editorRef =useRef<Quill |null>(null);

    
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    
    const [isPending, setisPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0);
    
    const {mutate : generateUploadUrl} =useGenerateUploadUrl();
    const {mutate: createMessage} = useCreateMessage();
    

    const handleSubmit = async ({
        body,
        image
    }:{
        body: string;
        image: File | null;
    
    })=>{
        console.log({body , image});
        try{
            setisPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                body,
                image:undefined,
            };
            if(image){
                const url = await generateUploadUrl({},{throwError: true});
                    console.log(url);
                    if(url===undefined){
                      throw new Error("Url not Found");
                    }
                    const result = await fetch(url,{
                        method: "POST",
                        headers: {"Content-Type": image.type},
                        body: image,
                    });
                    console.log(result);
                    if(!result.ok){
                        throw new Error("Failed to upload image");
                    }
                    const {storageId} = await result.json();
                    values.image = storageId;
            }                               
            //create message
            await createMessage(values ,{throwError: true});
            setEditorKey((prevKey)=> prevKey +1);
            toast.success("Message sent");
        } catch(error){
            toast.error("Failed to send message");
        } finally {
            setisPending(false);
            editorRef?.current?.enable(true);
        }
    };
    


    return(
        <div className="px-5 w-full">
            <Editor 
                key={editorKey}
                placeholder={placeholder}
                disabled={isPending}
                onSubmit={handleSubmit}
                innerRef={editorRef}
            variant="create"/>
        </div>
    );
}