import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-worspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-Item";

import { WorkspaceSection } from "./workspace-section";
import { useGetMember } from "@/features/members/api/use-get-member";
import { UserItem } from "./user-items";
import { useCreateChannelModal } from "@/features/Channels/store/use-create-channel-modal";

import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannels } from "@/features/Channels/api/use-get-channels";
import { useMemberId } from "@/hooks/use-member-id";

export const WorkspaceSidebar = () => {

  const memberId= useMemberId();

  const channelId= useChannelId();

  const workspaceId = useWorkspaceId();

  
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels,  } = useGetChannels({
    workspaceId,
  });
  const { data: members,  } = useGetMember({
    workspaceId,
  });
  const [_open , setOpen] = useCreateChannelModal();


  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#9564da]  h-auto items-center justify-center ">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-[#9564da]  h-auto items-center justify-center ">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#9564da] h-auto">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3 w-auto">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts and Sent" icon={SendHorizonal} id="drafts" />
      </div>

      <WorkspaceSection label="Channels" hint="New Channel" onNew={member.role==="admin"?() => setOpen(true):undefined} >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            variant={channelId === item._id? "active":"default"}
          />
        ))}
      </WorkspaceSection>
      
      <WorkspaceSection 
      label="Direct Messages" 
      hint="New direct Message" 
      onNew={() => {}}>
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id=== memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
