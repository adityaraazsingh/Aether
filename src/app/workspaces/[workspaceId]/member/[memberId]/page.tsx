"use client";

import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const [conversationId , setConversationId] = useState<Id<"conversations">| null>(null);

  const {  mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate({
      workspaceId,
      memberId,
    },{
      onSuccess(data){
        setConversationId(data);
      },
      onError(){
        toast.error("Failed to create or get Conversation");
      }
    });
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>;
  }

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span>
          Conversation not found
        </span>
      </div>
    );
  }

  return (
    <>
      <Conversation
        id={conversationId}
      />
    </>
  );
};

export default MemberIdPage;
