// pages/admin/PengajuanKonsultan.jsx
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import Loading from "../../component/Loading";

export default function PengajuanKonsultan() {
  const data = useQuery(api.consultants.getAllPengajuanConsultant);
  const approve = useMutation(api.consultants.approveConsultant);
  const reject = useMutation(api.consultants.rejectConsultant);

  const [loadingId, setLoadingId] = useState(null);

  if (!data) return <Loading />;

  const handleApprove = async (id) => {
    setLoadingId(id);
    await approve({ consultantId: id });
    setLoadingId(null);
  };

  const handleReject = async (id) => {
    setLoadingId(id);
    await reject({ consultantId: id });
    setLoadingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Pengajuan Konsultan</h1>
        </CardHeader>
        <CardBody>
          {!data ? (
            <p>Proses...</p>
          ) : data.length === 0 ? (
            <p>Tidak ada pengajuan.</p>
          ) : (
            <Table aria-label="Tabel pengajuan konsultan">
              <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>No Sertifikat</TableColumn>
                <TableColumn>Tempat Pelatihan</TableColumn>
                <TableColumn>Rekening</TableColumn>
                <TableColumn>Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.user_id}</TableCell>
                    <TableCell>{item.certificate_number}</TableCell>
                    <TableCell>{item.training_place_name}</TableCell>
                    <TableCell>{item.bank_account_number}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(item._id)}
                        disabled={loadingId === item._id}
                      >
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(item._id)}
                        disabled={loadingId === item._id}
                      >
                        Tolak
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
