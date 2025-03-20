import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name: string;
  image: string;
}

export const ConversationHero = ({ name, image }: ConversationHeroProps) => {
  const avatarFallback = name!.charAt(0).toUpperCase();
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex flex-col justify-center items-center">
        <Avatar className=" hover:opacity-75      transition">
          <AvatarImage alt={name} src={image} />
          <AvatarFallback className="bg-sky-400 text-white  ">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
          <p className="text-2xl font-bold "># {name}</p>
        <div>
          <p className="font-normal text-slate-800 mb-4">
            This conversation is in between <strong> you </strong> &{" "}
            <strong>
              <i> {name}</i>
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};
