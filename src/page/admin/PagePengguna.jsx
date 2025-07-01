import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import { useUser } from "@clerk/clerk-react";

export default function AdminPengguna() {
  const users = useQuery(api.users.getAllUsers);
  const updateRole = useMutation(api.users.updateUserRole);
  const deleteUser = useMutation(api.users.deleteUser);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const { user } = useUser();
  const currentAdminEmail = user?.emailAddresses?.[0]?.emailAddress;

  const ktpUrl = useQuery(
    api.storage.getUrl,
    selectedUser?.ktp_image_url
      ? { storageId: selectedUser.ktp_image_url }
      : "skip"
  );

  if (!users) return <Loading />;

  const handleChangeRole = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      await updateRole({ userId, role: newRole });
      alert("Role berhasil diperbarui!");
    } catch (err) {
      alert("Gagal mengubah role!");
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Yakin ingin menghapus pengguna ini?");
    if (!confirm) return;
    await deleteUser({ userId });
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Daftar Pengguna</h1>
      <Table aria-label="Tabel pengguna">
        <TableHeader>
          <TableColumn>Nama</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Aksi</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name || "-"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.email !== currentAdminEmail ? (
                  <Select
                    selectedKey={user.role}
                    defaultSelectedKeys={[user.role]}
                    onSelectionChange={(val) => {
                      const selectedRole = Array.from(val)[0];
                      handleChangeRole(user._id, selectedRole);
                    }}
                    isDisabled={updatingUserId === user._id}
                    className="w-[140px]"
                  >
                    <SelectItem key="user">User</SelectItem>
                    <SelectItem key="consultant">Consultant</SelectItem>
                    <SelectItem key="admin">Admin</SelectItem>
                  </Select>
                ) : (
                  <span className="text-sm text-gray-500">{user.role}</span>
                )}
              </TableCell>

              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="bordered"
                  onClick={() => handleOpenModal(user)}
                >
                  Lihat
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onClick={() => handleDelete(user._id)}
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail Pengguna
              </ModalHeader>
              <ModalBody>
                <p><strong>Nama:</strong> {selectedUser?.name || '-'}</p>
                <p><strong>Email:</strong> {selectedUser?.email}</p>
                <p><strong>Role:</strong> {selectedUser?.role}</p>
                <p><strong>NIK:</strong> {selectedUser?.nik || '-'}</p>
                <p><strong>Alamat:</strong> {selectedUser?.address || '-'}</p>
                <p><strong>Telepon:</strong> {selectedUser?.phone || '-'}</p>
                {ktpUrl && (
                  <div className="mt-4">
                    <p><strong>Foto KTP:</strong></p>
                    <img
                      src={ktpUrl}
                      alt="Foto KTP"
                      className="w-1/2 max-w-sm mt-2 rounded shadow"
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
