import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Spinner,
} from "@heroui/react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

export default function ChatsListPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const currentUser = useQuery(api.users.getUser, { userId: user?.id });
  const chatPartners = useQuery(api.chats.getChatPartners, {
    userId: currentUser?._id,
  });

  if (!currentUser || !chatPartners) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <h1 className="text-lg font-semibold">Daftar Chat</h1>
        </CardHeader>
        <CardBody className="divide-y divide-gray-200">
          {chatPartners.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              Belum ada percakapan.
            </p>
          ) : (
            chatPartners.map((partner) => (
              <div
                key={partner._id}
                className="flex items-center gap-4 py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition"
                onClick={() => navigate(`/chats/start/${partner._id}`)}
              >
                <Avatar
                  isBordered
                  name={partner.name || "Pengguna"}
                  src={partner.userId === user?.id ? user?.imageUrl : undefined}
                  alt="Foto Profil"
                />
                <div>
                  <p className="font-medium">
                    {partner.name || "Pengguna"}
                  </p>
                  <p className="text-sm text-gray-500">{partner.email}</p>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
