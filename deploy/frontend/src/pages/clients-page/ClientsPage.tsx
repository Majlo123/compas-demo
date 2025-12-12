import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PageLayout from '@/components/layout/PageLayout';
import Table, { Column, Row } from '@/components/controls/table/Table';
import { getClients } from '@/api/client/client.actions';
import { isApiSuccess } from '@/api/shared.types';

type ClientRow = Row & {
  id: string;
  name: string;
  hourlyRate: number;
  projectCount?: number;
};

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientRow[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(term));
  }, [clients, search]);

  const fetchClients = async () => {
    setIsLoading(true);
    setHasError(false);
    const response = await getClients();
    if (!isApiSuccess(response)) {
      setHasError(true);
      setIsLoading(false);
      toast.error(response.error?.message || 'Failed to load clients');
      return;
    }
    const data = response.content?.data || [];
    const mapped = data.map((c) => ({
      _id: c.id,
      ...c,
    } as ClientRow));
    setClients(mapped);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const columns: Column[] = [
    {
      accessor: 'name',
      header: 'Client Name',
    },
    {
      accessor: 'hourlyRate',
      header: 'Hourly Rate',
      formatter: (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `$${num.toFixed(2)}/hr`;
      },
    },
    {
      accessor: 'projectCount',
      header: '# of Projects',
    },
  ];

  return (
    <PageLayout
      title="Clients"
      action={(
        <div className="flex justify-between items-center w-30">
          <div className="flex gap-3 items-center w-full max-w-lg">
            <div className="relative w-full">
              <input
                id="clients-search"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg bg-transparent border-someGrey p-md text-p2 text-darkGrey"
              />
            </div>
          </div>
        </div>
      )}
      actionPosition="below"
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={!isLoading && !hasError && filteredClients.length === 0}
      onRetry={() => {
        setHasError(false);
        setIsLoading(false);
        fetchClients();
      }}
    >
      {/* Empty State */}
      {filteredClients.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.305 3.305a7.5 7.5 0 0010.345 10.345z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Clients Yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first client to get started managing projects and assignments.
          </p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredClients}
          tableClassName="bg-white rounded-none shadow-none mb-0"
        />
      )}

    </PageLayout>
  );
};

export default ClientsPage;


