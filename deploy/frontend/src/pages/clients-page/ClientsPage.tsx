import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Table, { Column, Row } from '@/components/controls/table/Table';
import Button from '@/components/controls/button/Button';
import { getClients } from '@/api/client/client.actions';
import { isApiSuccess } from '@/api/shared.types';
import DialogClientForm from '@/components/dialog/DialogClientForm';

type ClientRow = Row & {
  id: string;
  name: string;
  hourlyRate: number;
  projectCount?: number;
};

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientRow[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleEdit = (clientId: string) => {
    navigate(`/client-detail/${clientId}`);
  };

  const handleAddClient = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateClient = async (data: { name: string; hourlyRate: number }) => {
    const newClient: ClientRow = {
      _id: `${Date.now()}`,
      id: `${Date.now()}`,
      name: data.name,
      hourlyRate: data.hourlyRate,
      projectCount: 0,
    };
    setClients(prev => [newClient, ...prev]);
    toast.success('Client created successfully!');
    handleCloseAddModal();
  };

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
    {
      accessor: 'actions',
      header: 'Actions',
      formatter: (_value: any, row: any) => (
        <button
          onClick={() => handleEdit(row._id)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
          title="Edit client"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Clients"
      action={(
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex gap-3 items-center flex-1 max-w-lg">
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
          <Button onClick={handleAddClient} variant="primary" className="inline-flex items-center gap-2">
            <span>+</span>
            <span>New Client</span>
          </Button>
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

      <DialogClientForm isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onCreate={handleCreateClient} />
    </PageLayout>
  );
};

export default ClientsPage;