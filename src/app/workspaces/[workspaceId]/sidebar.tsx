import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspaceswitcher";
import { SidebarButton } from "./sidebarbutton";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";


export const Sidebar = () => {
  const pathname = usePathname();


  return (
    <aside className="md:w-[70px] md:h-auto bg-[#481493] w-full h-[10vh] max-md:justify-end">
      <div className="flex md:flex-col items-center md:justify-between gap-y-1 mt-auto h-full justify-center">
        <div className="flex gap-2 md:flex-col md:justify-evenly md:p-1 md:gap-y-3">
          <WorkspaceSwitcher />
          
          <SidebarButton
            icon={Home}
            label="Home"
            
            isActive={pathname.includes("/workspaces")}
          />
          <SidebarButton icon={MessagesSquare} label="DMs" />
          <SidebarButton icon={Bell} label="Activity" />
          <SidebarButton icon={MoreHorizontal} label="More" />
        </div>
        <div>
          <UserButton />
        </div>
      </div>
    </aside>
  );
};
