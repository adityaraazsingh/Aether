"use client"

import { useGetChannel } from "@/features/Channels/api/use-get-channel";

import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";

import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";






const ChannelIdPage = () =>{

    const channelId = useChannelId();

    const {data: channel , isLoading : channelsLoading}= useGetChannel({id: channelId });
    const {results, status , loadMore} = useGetMessages({channelId});

    console.log({results});

    if(channelsLoading || status === "LoadingFirstPage"){
        return (
            <div className="h-full flex-1 flex sitems-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    if( !channel){
        return (
            <div className="h-full flex-1 flex 
            flex-col gap-y-2 items-center justify-center">
                <TriangleAlert className="size-5 text-muted-foreground"/>
                <span className="text-sm text-muted-foreground">
                    Channel not found
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
           <Header title={channel.name} />
                <MessageList 
                    channelName ={channel.name}
                    channelCreationTime={channel._creationTime}
                    data={results}
                    loadMore={loadMore}
                    isLoadingMore={status === "LoadingMore"}
                    canLoadMore = {status === "CanLoadMore"}
                />
            <ChatInput placeholder={`Message # ${channel.name}`}/>
        </div> 
    );
};

export default ChannelIdPage;