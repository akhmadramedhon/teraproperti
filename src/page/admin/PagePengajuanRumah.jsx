import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import Loading from "../../component/Loading";

export default function PagePengajuanRumah() {
  const rumahList = useQuery(api.houses.getAllPengajuan);
  const approvePengajuan = useMutation(api.houses.approvePengajuan);
  const tolakPengajuan = useMutation(api.houses.tolakPengajuan);
  const deletePengajuan = useMutation(api.houses.deletePengajuan);

  if (!rumahList) return <Loading />;

  const handleApprove = async (id) => {
    await approvePengajuan({ houseId: id });
  };

  const handleTolak = async (id) => {
    await tolakPengajuan({ houseId: id });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengajuan ini?")) {
      await deletePengajuan({ houseId: id });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Pengajuan Rumah</h1>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <Table aria-label="Tabel pengajuan rumah" className="min-w-[800px]">
            <TableHeader>
              <TableColumn className="text-gray-600">Nama Pemilik</TableColumn>
              <TableColumn className="text-gray-600">NIB</TableColumn>
              <TableColumn className="text-gray-600">Status</TableColumn>
              <TableColumn className="text-gray-600 text-center">Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {rumahList.map((rumah) => (
                <TableRow key={rumah._id}>
                  <TableCell className="font-medium">{rumah.ownerName}</TableCell>
                  <TableCell>{rumah.nib || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          rumah.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : rumah.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {rumah.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap justify-center">
                      <Link to={`/admin/pengajuan/${rumah._id}`}>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </Link>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(rumah._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleTolak(rumah._id)}
                      >
                        Tolak
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(rumah._id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
