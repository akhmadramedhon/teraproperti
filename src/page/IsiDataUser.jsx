import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";

export default function IsiDataUser() {
  const { user } = useUser();
  const saveUser = useMutation(api.users.saveUser);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl); // ✅ DITAMBAHIN INI
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [ktp, setKtp] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama || !nik || !ktp) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const uploadUrl = await generateUploadUrl(); // ✅ Ambil upload URL dari server
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": ktp.type,
        },
        body: ktp,
      });

      const { storageId } = await response.json();
    if (!storageId) {
      alert("Gagal mengupload gambar KTP.");
      return;
    }
  
    
    await saveUser({
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: nama,
      nik,
      ktp_image_url: storageId,
      role: "user",
      address: alamat,
      phone: telepon,
    });

      alert("Data berhasil disimpan!");
      navigate("/teraproperti/");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <p className="text-lg font-semibold">Lengkapi Data Diri</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm mb-1 text-gray-700">Nama Lengkap</p>
              <Input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div>
              <p className="text-sm mb-1 text-gray-700">NIK</p>
              <Input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="NIK"
                required
              />
            </div>
            
            <div>
              <p className="text-sm mb-1 text-gray-700">Alamat</p>
              <Input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Alamat lengkap"
                required
              />
            </div>
            
            <div>
              <p className="text-sm mb-1 text-gray-700">No. Telepon</p>
              <Input
                type="text"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="08xxxxx"
                required
              />
            </div>
            
            <div>
              <p className="text-sm mb-1 text-gray-700">Foto KTP</p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setKtp(e.target.files[0])}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
