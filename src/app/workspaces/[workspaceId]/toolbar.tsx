import { Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-worspace";

import {
  
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  
} from "@/components/ui/command";
import { useState } from "react";
import { useGetChannels } from "@/features/Channels/api/use-get-channels";
import { useGetMember } from "@/features/members/api/use-get-member";

import { useRouter } from "next/navigation";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMember({ workspaceId });

  const channelClick =(channelId : string)=>{
    setOpen(false);

    router.push(`/workspaces/${workspaceId}/channel/${channelId}`);
  }
  const memberClick =(memberId : string)=>{
    setOpen(false);

    router.push(`/workspaces/${workspaceId}/member/${memberId}`);
  }

  return (
    <nav
      className="bg-[#481493]
        flex items-center justify-center h-[7vh] p-1.5"
    >
      <div className="flex-1" />
      <div className="w-full flex items-center justify-center min-w-[280px] max-[642px] shrink ">
        <Button
          size="sm"
          className=" bg-accent/25 hover:bg-opacity-10 w-1/2  justify-start h-7 px-2"
          variant="transparent"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 text-white text-xs mr-2" />

          <span className="text-white text-xs  ">
            Search workspace " {data?.name} "
          </span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                
                  <CommandItem 
                  key={channel._id}
                  onSelect={()=>channelClick(channel._id)}>
                    <span>{channel.name}</span>
                  </CommandItem>
                
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem key={member._id} onSelect={()=>memberClick(member._id)}>
                    <span>{member.user.name}</span>
                  
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <div className="ml-auto flex-1 flex items-center justify-end">
          <Button variant="transparent" size="iconsm">
            <Info className="size-5 text-white" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
