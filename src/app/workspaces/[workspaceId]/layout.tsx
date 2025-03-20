"use client";

import { WorkspaceSidebar } from "./workspace-sidebar";

import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";

import { Profile } from "@/features/members/components/profile";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId,profileMemberId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full ">
      <Toolbar />
      <div className="flex md:h-[calc(100vh-40px)] max-md:flex-col-reverse">
        <Sidebar />

        <div className="max-md:h-[calc(100vh-10vh-7vh)] ">


        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >

          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#b683ff]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={80}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <div>

                      <Thread
                          messageId = {parentMessageId as Id<"messages">}
                          onClose = {onClose}
                      />

                  </div>
                ) : profileMemberId? (
                  <Profile 
                       memberId= {profileMemberId as Id<"members">}
                       onClose={onClose}               
                    />
                ):(
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
