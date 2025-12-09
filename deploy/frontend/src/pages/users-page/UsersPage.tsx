import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Table, { Column, Row } from '@/components/controls/table/Table';
import Button from '@/components/controls/button/Button';
import PageLayout from '@/components/layout/PageLayout';
import { getUsers, searchUsers, deactivateUser, distributeAnnualLeave } from '@/api/user/user.actions';
import { isApiSuccess } from '@/api/shared.types';
import usePagination from '@/hooks/usePagination';
import Pagination from '@/components/controls/Pagination';
import PageSizeSelector from '@/components/controls/PageSizeSelector';
import { useDebounce } from 'use-debounce';
import DialogInviteUsers from '@/components/dialog/DialogInviteUsers';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import DialogEditVacationDays from '@/components/dialog/DialogEditVacationDays';
import { useAuthStore } from '@/stores/useAuthStore';
import { RoleEnum } from '../../../../shared/auth.types';

interface UserRow extends Row {
  id: string;
  fullName: string;
  email: string;
  vacationDaysInit?: number;
  vacationDaysLeft?: number;
}

const UsersPage: React.FC = () => {
  const { page, pageSize, setPageSize, setPage } = usePagination();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editVacationDaysOpen, setEditVacationDaysOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; vacationDaysInit: number; vacationDaysLeft: number } | null>(null);
  const [confirmAnnualLeaveOpen, setConfirmAnnualLeaveOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => setPage(1), [debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, debouncedSearch]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      if (debouncedSearch && debouncedSearch.trim() !== '') {
        const response = await searchUsers(debouncedSearch);
        if (isApiSuccess(response)) {
          const userRows: UserRow[] = response.content.map((u: any) => ({
            _id: u.id,
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            vacationDaysInit: u.vacationDaysInit ?? 0,
            vacationDaysLeft: u.vacationDaysLeft ?? 0
          }));
          setUsers(userRows);
          setTotalPages(1);
        } else {
          setHasError(true);
          toast.error(response.error?.message || 'Failed to search users');
        }
      } else {
        const response = await getUsers(page, pageSize);
        if (isApiSuccess(response)) {
          const userRows: UserRow[] = response.content.data.map((u: any) => ({
            _id: u.id,
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            vacationDaysInit: u.vacationDaysInit ?? 0,
            vacationDaysLeft: u.vacationDaysLeft ?? 0
          }));
          setUsers(userRows);
          setTotalPages(response.content.totalPages);
        } else {
          setHasError(true);
          toast.error(response.error?.message || 'Failed to load users');
        }
      }
    } catch (err) {
      setHasError(true);
      toast.error('An error occurred while loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (userId: string): void => {
    setUserToDelete(userId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!userToDelete) return;
    try {
      const response = await deactivateUser(userToDelete);
      if (isApiSuccess(response)) {
        toast.success('User removed successfully');
        fetchUsers();
      } else {
        toast.error(response.error?.message || 'Failed to remove user');
      }
    } catch (err) {
      toast.error('An error occurred while removing user');
    } finally {
      setUserToDelete(null);
      setConfirmDeleteOpen(false);
    }
  };

  const handleAddAnnualLeave = async () => {
    setConfirmAnnualLeaveOpen(true);
  };

  const handleConfirmAnnualLeave = async (): Promise<void> => {
    try {
      const response = await distributeAnnualLeave(21);
      if (isApiSuccess(response)) {
        toast.success(`Successfully added 21 days to ${response.content.updatedCount} users`);
        fetchUsers();
      } else {
        toast.error(response.error?.message || 'Failed to distribute days');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setConfirmAnnualLeaveOpen(false);
    }
  };

  const columns: Column[] = [
    {
      accessor: 'fullName',
      header: 'User Name',
    },
    { accessor: 'email', header: 'Email' },
    {
      accessor: 'teams',
      header: 'Projects',
      formatter: (_v: any, _row: any) => (
        <span>-</span>
      )
    },
    {
      accessor: 'vacationDaysLeft',
      header: 'Vacation Days',
      formatter: (_value: any, row: any) => (
        <span className="font-medium">
          {row.vacationDaysLeft ?? 0} / {row.vacationDaysInit ?? 0}
        </span>
      ),
    },
    {
      accessor: 'actions',
      header: 'Actions',
      formatter: (_v: any, row: any) => (
        <div className="flex gap-2 items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedUser({
                id: row.id,
                name: row.fullName,
                vacationDaysInit: row.vacationDaysInit ?? 0,
                vacationDaysLeft: row.vacationDaysLeft ?? 0
              });
              setEditVacationDaysOpen(true);
            }}
            disabled={!user || (user.role !== RoleEnum.Admin && !user.isTeamManager)}
          >
            Edit Days
          </Button>
          <Button
            variant="delete"
            size="sm"
            onClick={() => handleDeleteClick(row.id)}
            disabled={!user || (user.role !== RoleEnum.Admin)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Users"
      action={
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3 items-center flex-1 max-w-xl">
            <div className="relative flex-1">
              <input
                id="users-search"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg bg-transparent border-someGrey p-md text-p2 text-darkGrey"
              />
            </div>
            {user && (user.role === RoleEnum.Admin || user.isTeamManager) && (
              <Button
                variant="primary"
                onClick={() => setInviteOpen(true)}
                className="h-[48px] whitespace-nowrap px-4"
              >
                Invite User
              </Button>
            )}
          </div>
          {user && user.role === RoleEnum.Admin && (
            <Button
              variant="secondary"
              onClick={handleAddAnnualLeave}
              className="h-[48px] whitespace-nowrap px-4 ml-4"
            >
              Add Annual Leave (+21)
            </Button>
          )}
        </div>
      }
      actionPosition="below"
      emptyMessage="No users yet"
      emptyDescription="Add users to get started"
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={users.length === 0 && !search}
      onRetry={fetchUsers}
    >
      <Table columns={columns} data={users} tableClassName="text-p2 lg:text-p1" headerClassName="text-p2 lg:text-p1 font-bold" cellClassName="text-p2 lg:text-p1" />

      <div className="flex justify-between items-center mt-4">
        <PageSizeSelector pageSize={pageSize} onChange={setPageSize} />
        <Pagination totalPages={totalPages} />
      </div>
      <DialogInviteUsers
        isOpen={inviteOpen}
        onOpenChange={setInviteOpen}
        onSuccess={() => {
          // Optionally refresh users list after invite
          fetchUsers();
        }}
      />
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete User"
        message="Are you sure you want to remove this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        isOpen={confirmAnnualLeaveOpen}
        onOpenChange={setConfirmAnnualLeaveOpen}
        title="Add Annual Leave"
        message="Are you sure you want to add 21 vacation days to ALL active users? This action cannot be undone."
        confirmText="Add"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleConfirmAnnualLeave}
      />
      {selectedUser && (
        <DialogEditVacationDays
          isOpen={editVacationDaysOpen}
          onOpenChange={setEditVacationDaysOpen}
          userId={selectedUser.id}
          userName={selectedUser.name}
          currentVacationDaysInit={selectedUser.vacationDaysInit}
          currentVacationDaysLeft={selectedUser.vacationDaysLeft}
          onSuccess={() => {
            fetchUsers();
          }}
        />
      )}
    </PageLayout >
  );
};

export default UsersPage;