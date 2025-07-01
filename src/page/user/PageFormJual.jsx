import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Textarea,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useAction } from "convex/react";
import { useNavigate } from "react-router-dom";

export default function PageFormJual() {
  const { user } = useUser();
  const navigate = useNavigate();
  const currentUser = useQuery(api.users.getUser, { userId: user?.id });

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const submitHouse = useMutation(api.houses.submitHouse);
  const createPayment = useMutation(api.houseAdsPayments.createHouseAdPayment);
  const generateSnapToken = useAction(api.generateSnapToken.generateSnapToken);

  const [formData, setFormData] = useState({
    sertifikat: "",
    nib: "",
    nomorDesa: "",
    tanggalLahir: "",
    asalHak: "",
    dasarPenerbitan: "",
    luasTanah: "",
    kelengkapan: "",
    rt: "",
    rw: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    title: "",
    price: "",
    facilities: [],
    sertifikatFile: null,
    fotoRumah: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, facilities: [...prev.facilities, value] };
      } else {
        return {
          ...prev,
          facilities: prev.facilities.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sertifikatFile || !formData.fotoRumah || !currentUser) return;

    try {
      // Upload Sertifikat
      const uploadPdfUrl = await generateUploadUrl();
      const resPdf = await fetch(uploadPdfUrl, {
        method: "POST",
        headers: { "Content-Type": formData.sertifikatFile.type },
        body: formData.sertifikatFile,
      });
      const { storageId: pdfId } = await resPdf.json();

      // Upload Foto Rumah
      const uploadImgUrl = await generateUploadUrl();
      const resImg = await fetch(uploadImgUrl, {
        method: "POST",
        headers: { "Content-Type": formData.fotoRumah.type },
        body: formData.fotoRumah,
      });
      const { storageId: imgId } = await resImg.json();

      // Submit Data Rumah
      const houseId = await submitHouse({
        user_id: currentUser._id,
        certificate_type: formData.sertifikat,
        nib: formData.nib,
        village_number: formData.nomorDesa,
        owner_birth_date: formData.tanggalLahir,
        origin_rights: formData.asalHak,
        issuance_basis: formData.dasarPenerbitan,
        land_area: formData.luasTanah,
        room_info: formData.kelengkapan,
        rt: formData.rt,
        rw: formData.rw,
        village: formData.desa,
        district: formData.kecamatan,
        city: formData.kabupaten,
        province: formData.provinsi,
        title: formData.title,
        price: parseInt(formData.price),
        facilities: formData.facilities,
        certificate_pdf_url: pdfId,
        house_image_url: imgId,
      });

      // Buat data pembayaran iklan rumah
      await createPayment({
        house_id: houseId,
        user_id: currentUser._id,
      });

      localStorage.setItem("unpaid_house_id", houseId);

      const snapToken = await generateSnapToken({
        houseId,
        userName: currentUser.name || "User",
        amount: 50000,
      });

      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            localStorage.removeItem("unpaid_house_id");
            alert("Pembayaran berhasil!");
            navigate("/");
          },
          onClose: () => {
            alert("Silakan selesaikan pembayaran untuk melanjutkan.");
          },
        });
      }
    } catch (err) {
      console.error("Gagal submit:", err);
      alert("Gagal mengajukan rumah. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    const unpaidHouseId = localStorage.getItem("unpaid_house_id");

    const showSnapAgain = async () => {
      if (!unpaidHouseId || !currentUser) return;

      try {
        const snapToken = await generateSnapToken({
          houseId: unpaidHouseId,
          userName: currentUser.name || "User",
          amount: 50000,
        });

        if (window.snap && snapToken) {
          window.snap.pay(snapToken, {
            onSuccess: () => {
              localStorage.removeItem("unpaid_house_id");
              alert("Pembayaran berhasil!");
              navigate("/");
            },
            onClose: () => {
              alert("Silakan selesaikan pembayaran untuk melanjutkan.");
            },
          });
        }
      } catch (error) {
        console.error("Gagal generate snap token ulang:", error);
      }
    };

    showSnapAgain();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Form Pengajuan Jual Rumah</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Jenis Sertifikat" name="sertifikat" onChange={handleChange} required />
            <Input label="Nomor Identifikasi Bidang (NIB)" name="nib" onChange={handleChange} required />
            <Input label="Nomor Desa/Kelurahan" name="nomorDesa" onChange={handleChange} required />
            <Input label="Tanggal Lahir Pemilik" name="tanggalLahir" type="date" onChange={handleChange} required />
            <Input label="Asal Hak" name="asalHak" onChange={handleChange} required />
            <Input label="Dasar Penerbitan" name="dasarPenerbitan" onChange={handleChange} required />
            <Input label="Luas Tanah (m²)" name="luasTanah" onChange={handleChange} required />
            <Textarea label="Kelengkapan Rumah (cth: 3 kamar tidur, 2 kamar mandi)" name="kelengkapan" onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="RT" name="rt" onChange={handleChange} required />
              <Input label="RW" name="rw" onChange={handleChange} required />
              <Input label="Desa/Kelurahan" name="desa" onChange={handleChange} required />
              <Input label="Kecamatan" name="kecamatan" onChange={handleChange} required />
              <Input label="Kabupaten/Kota" name="kabupaten" onChange={handleChange} required />
              <Input label="Provinsi" name="provinsi" onChange={handleChange} required />
            </div>
            <Input label="Judul Iklan Rumah" name="title" onChange={handleChange} required />
            <Input label="Harga Rumah (Rp)" name="price" type="number" onChange={handleChange} required />
            <div>
              <p className="text-sm font-medium">Fasilitas:</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {["AC", "Garasi", "Taman", "Kolam Renang", "Dapur", "Gudang"].map((fasilitas) => (
                  <label key={fasilitas} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={fasilitas}
                      onChange={handleCheckboxChange}
                    />
                    <span>{fasilitas}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-1 text-gray-700">Upload Sertifikat (PDF)</p>
              <Input type="file" name="sertifikatFile" accept="application/pdf" onChange={handleChange} required />
            </div>
            <div>
              <p className="text-sm mb-1 text-gray-700">Upload Foto Rumah</p>
              <Input type="file" name="fotoRumah" accept="image/*" onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full mt-4">
              Ajukan Penjualan Rumah
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
