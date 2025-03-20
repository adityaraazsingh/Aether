

import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { useCreateMessage } from "@/features/messages/api/use-create-message";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

import { Id } from "../../../../../../convex/_generated/dataModel";


const Editor = dynamic(()=>import ("@/components/editor"),{ssr: false});

interface ChatInputProps{
    placeholder: string;
    conversationId:Id<"conversations">;
};

type CreateMessageValues = {
    conversationId: Id<"conversations">
    workspaceId : Id<"workspaces">
    body: string;
    image: Id<"_storage"> |undefined;
};


export const ChatInput=({placeholder , conversationId}:ChatInputProps)=>{

    const [isPending, setisPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0);

    const editorRef =useRef<Quill |null>(null);


    const workspaceId = useWorkspaceId();
    
    
    const {mutate : generateUploadUrl} =useGenerateUploadUrl();
    const {mutate: createMessage} = useCreateMessage();
    

    const handleSubmit = async ({
        body,
        image
    }:{
        body: string;
        image: File | null;
    
    })=>{
        try{
            setisPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                conversationId,
                workspaceId,

                body,
                image:undefined,
            };
            if(image){
                const url = await generateUploadUrl({},{throwError: true});
                    if(url===undefined){
                      throw new Error("Url not Found");
                    }
                    const result = await fetch(url,{
                        method: "POST",
                        headers: {"Content-Type": image.type},
                        body: image,
                    });
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