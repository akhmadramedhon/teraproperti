import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Input,
  Button,
  Spinner,
} from "@heroui/react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ChatDetailPage() {
  const { user } = useUser();
  const { id: partnerId } = useParams(); // userId dari lawan bicara
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  const currentUser = useQuery(api.users.getUser, { userId: user?.id });
  const partnerUser = useQuery(api.users.getById, { userId: partnerId });
  const chatHistory = useQuery(api.chats.getChatHistory, {
    userA: currentUser?._id,
    userB: partnerId,
  });
  const sendMessage = useMutation(api.chats.sendMessage);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage({
      sender_id: currentUser._id,
      receiver_id: partnerId,
      message,
    });
    setMessage("");
  };

  if (!currentUser || !partnerUser || !chatHistory) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 flex flex-col h-[calc(100vh-5rem)]">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="flex items-center gap-4 border-b">
          <Avatar
            name={partnerUser.name}
            src={partnerUser.userId === user?.id ? user?.imageUrl : undefined}
            alt="Foto Profil"
          />
          <h2 className="font-medium">{partnerUser.name || "Pengguna"}</h2>
        </CardHeader>

        <CardBody className="flex flex-col justify-between flex-1 overflow-y-auto p-4 space-y-2">
          {chatHistory.length === 0 && (
            <p className="text-center text-gray-500 mt-10">Belum ada pesan.</p>
          )}

          {chatHistory.map((msg) => {
            const isMe = msg.sender_id === currentUser._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl shadow text-sm ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                  <div className="text-[10px] mt-1 text-right opacity-70">
                    {new Date(msg.sent_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </CardBody>

        <div className="border-t p-3 flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder="Ketik pesan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Kirim</Button>
        </div>
      </Card>
    </div>
  );
}
