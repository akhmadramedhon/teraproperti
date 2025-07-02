import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  CardBody,
  Button,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Loading from "../../component/Loading";

export default function DetailPengajuanRumah() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rumah = useQuery(api.houses.getDetailById, { houseId: id });

  const approve = useMutation(api.houses.approvePengajuan);
  const reject = useMutation(api.houses.tolakPengajuan);

  const sertifikatUrl = useQuery(api.storage.getUrl, {
    storageId: rumah?.certificate_pdf_url,
  });
  const fotoRumahUrl = useQuery(api.storage.getUrl, {
    storageId: rumah?.house_image_url,
  });

  if (!rumah) return <Loading />;

  const handleApprove = async () => {
    await approve({ houseId: id });
    alert("Pengajuan disetujui");
    navigate("/teraproperti/admin/rumah");
  };

  const handleReject = async () => {
    await reject({ houseId: id });
    alert("Pengajuan ditolak");
    navigate("/teraproperti/admin/rumah");
  };

  const dataList = [
    ["Judul Iklan", rumah.title],
    ["Nama Pemilik", rumah.ownerName || "Unknown"],
    ["NIB", rumah.nib],
    ["Nomor Desa", rumah.village_number],
    ["Tanggal Lahir Pemilik", rumah.owner_birth_date],
    ["Asal Hak", rumah.origin_rights],
    ["Dasar Penerbitan", rumah.issuance_basis],
    ["Jenis Sertifikat", rumah.certificate_type],
    ["Luas Tanah", rumah.land_area + " m²"],
    ["RT/RW", `${rumah.rt}/${rumah.rw}`],
    ["Desa", rumah.village],
    ["Kecamatan", rumah.district],
    ["Kabupaten", rumah.city],
    ["Provinsi", rumah.province],
    ["Harga Rumah", `Rp ${rumah.price?.toLocaleString("id-ID")}`],
    ["Fasilitas", rumah.facilities?.join(", ") || "-"],
    ["Status", rumah.status],
    ["Tanggal Pengajuan", new Date(rumah.created_at).toLocaleString()],
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Detail Pengajuan Rumah</h2>
          <div className="flex gap-2">
            <Button variant="success" size="sm" onClick={handleApprove}>
              Approve
            </Button>
            <Button variant="destructive" size="sm" onClick={handleReject}>
              Tolak
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <Table isStriped>
            <TableHeader>
              <TableColumn>Label</TableColumn>
              <TableColumn>Data</TableColumn>
            </TableHeader>
            <TableBody>
              {dataList.map(([label, value]) => (
                <TableRow key={label}>
                  <TableCell className="font-medium">{label}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">Sertifikat (PDF)</TableCell>
                <TableCell>
                  <a
                    href={sertifikatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download Sertifikat
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Foto Rumah</TableCell>
                <TableCell>
                  <img
                    src={fotoRumahUrl}
                    alt="Foto Rumah"
                    className="rounded shadow w-full max-w-md"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
