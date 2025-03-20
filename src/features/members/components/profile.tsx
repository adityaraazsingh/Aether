import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, ChevronDownIcon, Loader, XIcon } from "lucide-react";
import { useGetOnlyOneMember } from "../api/use-get-only-one-member";

import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { toast } from "sonner";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
  role?: "admin" | "member";
}

export const Profile = ({ memberId,  onClose }: ProfileProps) => {
  const { data: member, isLoading: isLoadingMember } = useGetOnlyOneMember({
    id: memberId,
  });

  const router = useRouter();

  const [UpdateDialog, confirmupdate] = useConfirm(
    "Change Role",
    "Are you sure you want to change this member role?"
  );

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "Are you sure you want to leave this workspace?"
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?"
  );

  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };
  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You Left the workspace");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave worksapce");
        },
      }
    );
  };
  const onUpdate = async (role: "admin" | "member") => {
   
    const ok = await confirmupdate();

    if (!ok) return;

    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Role Changed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to change role");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-xl font-bold">Profile</p>
          <Button onClick={onClose} size="iconsm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-xl font-bold">Profile</p>
          <Button onClick={onClose} size="iconsm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name!.charAt(0).toUpperCase();

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateDialog />

      <div className="mt-[88px] mx-5 mb-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <Avatar className=" rounded-md size-20 hover:opacity-75  transition">
            <AvatarImage alt={member.user.name} src={member.user.image} />
            <AvatarFallback className="bg-sky-400 text-white rounded-md">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col justify-center items-center">
            <p className="font-normal text-xl text-slate-800 mb-4">
              <strong>
                <i> {member.user.name}</i>
              </strong>
            </p>
            {currentMember?.role === "admin" &&
            currentMember?._id !== memberId ? (
              <div className="flex items-center gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full capitalize">
                      {member.role} <ChevronDownIcon className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role)=> onUpdate(role as "admin" | "member")}
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member ">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={onRemove} variant="outline">
                  Remove
                </Button>
              </div>
            ) : currentMember?._id === memberId &&
              currentMember?.role !== "admin" ? (
              <div className="mt-4">
                <Button className="w-full capitalize" onClick={onLeave}>
                  Leave
                </Button>
              </div>
            ) : null}
          </div>
          <Separator />
          <p className="font-bold border-gray-300">Contact Information</p>
          <Separator />
          <div className="flex gap-5 justify-start ">
            <button>
              <MdEmail className="size-10" />
            </button>
            <div>
              <p className="text-bold">
                <u>EmailId</u>
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {" "}
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
