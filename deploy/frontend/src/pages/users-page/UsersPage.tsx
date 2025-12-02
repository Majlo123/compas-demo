import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Table, { Column, Row } from '@/components/controls/table/Table';
import Button from '@/components/controls/button/Button';
import PageLayout from '@/components/layout/PageLayout';
import { getUsers, searchUsers } from '@/api/user/user.actions';
import { isApiSuccess } from '@/api/shared.types';
import usePagination from '@/hooks/usePagination';
import Pagination from '@/components/controls/Pagination';
import PageSizeSelector from '@/components/controls/PageSizeSelector';
import { useDebounce } from 'use-debounce';

interface UserRow extends Row {
  id: string;
  fullName: string;
  email: string;
}

const UsersPage: React.FC = () => {
  const { page, pageSize, setPageSize, setPage } = usePagination();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);

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
          const formatted = response.content.map((u: any) => ({ _id: u.id, id: u.id, fullName: u.fullName, email: u.email }));
          setUsers(formatted);
          setTotalPages(1);
        } else {
          setHasError(true);
          toast.error(response.error?.message || 'Failed to search users');
        }
      } else {
        const response = await getUsers(page, pageSize);
        if (isApiSuccess(response)) {
          setUsers(response.content.data.map((u: any) => ({ _id: u.id, id: u.id, fullName: u.fullName, email: u.email })));
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

  const columns: Column[] = [
    {
      accessor: 'fullName',
      header: 'User Name',
    },
    { accessor: 'email', header: 'Email' },
    {
      accessor: 'teams',
      header: 'Teams',
      formatter: (_v: any, _row: any) => (
        // For now, we don't fetch or show real teams — placeholder column
        <span>-</span>
      ),
    },
    {
      accessor: 'actions',
      header: 'Actions',
      formatter: (_v: any, _row: any) => (
        <div className="flex gap-2 items-center justify-center">
          {/* Keep the button look from TeamDetails (variant delete, size sm), but do nothing */}
          <Button variant="delete" size="sm" disabled>
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
        <div className="flex gap-4 items-center xl:w-2/3">
          <div className="relative flex-1">
            <input
              id="users-search"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg bg-transparent border-someGrey p-md text-p2 text-darkGrey"
            />
          </div>
        </div>
      }
      actionPosition="inline"
      emptyMessage="No users yet"
      emptyDescription="Add users to get started"
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={users.length === 0}
      onRetry={fetchUsers}
    >
      <Table columns={columns} data={users} tableClassName="text-p2 lg:text-p1" headerClassName="text-p2 lg:text-p1 font-bold" cellClassName="text-p2 lg:text-p1" />

      <div className="flex justify-between items-center mt-4">
        <PageSizeSelector pageSize={pageSize} onChange={setPageSize} />
        <Pagination totalPages={totalPages} />
      </div>
    </PageLayout>
  );
};

export default UsersPage;
