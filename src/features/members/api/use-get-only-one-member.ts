  import { useQuery } from "convex/react";

  import { api } from "../../../../convex/_generated/api";

  import { Id } from "../../../../convex/_generated/dataModel";

  interface useGetOnlyOneMemberProps{
    id : Id<"members">;

  };

  export const useGetOnlyOneMember = ({id}:useGetOnlyOneMemberProps) =>{
    const data = useQuery(api.members.getById,{id});

    const isLoading = data === undefined;

    return {data , isLoading};


  }