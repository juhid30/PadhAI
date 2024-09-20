import React from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  Thread,
  Window,
  MessageList,
  MessageInput,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

import { StreamChat } from "stream-chat";

const chatClient = new StreamChat("smah3nvgyqgw");
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiamFzaC1yYXNobmUifQ.6C04ybnSxwq6IMN3KodJtgkDEhQWiPs5JtMllTjJn9I";

chatClient.setUser(
  {
    id: "jash-rashne",
    name: "Jash Rashne",
    image:
      "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJash.JPG?alt=media&token=9bdc90ec-805b-46af-a9ce-43d0a66b4b66",
  },
  userToken
);

const channel = chatClient.channel("messaging", "godevs", {
  image:
    "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJash.JPG?alt=media&token=9bdc90ec-805b-46af-a9ce-43d0a66b4b66",
  name: "Test Name",
});

const TestChat = () => {
  return (
    <Chat client={chatClient} theme={"messaging light"}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default TestChat;
