import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Avatar,
} from "@heroui/react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import Loading from "../component/Loading";

export default function ProfilePage() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getUser, { userId: user?.id });
  const updateProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const [ktpFile, setKtpFile] = useState(null);

  if (!user || !currentUser) return <Loading />;

  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    address: "",
    phone: "",
  });

  const ktpUrl = useQuery(api.storage.getUrl, {
    storageId: currentUser?.ktp_image_url,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        nik: currentUser.nik || "",
        address: currentUser.address || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let ktp_image_url = currentUser.ktp_image_url;

      if (ktpFile) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": ktpFile.type,
          },
          body: ktpFile,
        });

        const data = await response.json();
        if (data.storageId) {
          ktp_image_url = data.storageId;
        }
      }

      await updateProfile({
        userId: currentUser._id,
        ...formData,
        ktp_image_url,
      });

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui profil.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card className="p-6 md:p-10">
        <CardHeader>
          <h1 className="text-lg font-semibold">Profile</h1>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Kiri: Avatar & Foto KTP */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <Avatar
                isBordered
                size="xl"
                src={user?.imageUrl}
                alt="Profile Picture"
                className="w-1/4 md:w-full"
              />
              {ktpUrl && (
                <img
                  src={ktpUrl}
                  alt="Foto KTP"
                  className="mt-4 w-full rounded shadow"
                />
              )}
            </div>
    
            {/* Kanan: Form */}
            <form onSubmit={handleSubmit} className="w-full md:w-2/3 space-y-4">
              <div>
                <p className="text-sm mb-1 text-gray-700">Name</p>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                />
              </div>
              <div>
                <p className="text-sm mb-1 text-gray-700">Email Address</p>
                <Input value={user?.emailAddresses[0].emailAddress} disabled />
              </div>
              <div>
                <p className="text-sm mb-1 text-gray-700">NIK</p>
                <Input
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="NIK"
                />
              </div>
              <div>
                <p className="text-sm mb-1 text-gray-700">Phone</p>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="No. Telepon"
                />
              </div>
              <div>
                <p className="text-sm mb-1 text-gray-700">Address</p>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Alamat"
                />
              </div>
              <div>
                <p className="text-sm mb-1 text-gray-700">Ganti Foto KTP</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setKtpFile(e.target.files[0])}
                />
              </div>
              <Button type="submit" className="mt-4 w-full">
                Update Profile
              </Button>
            </form>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
