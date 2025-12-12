import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import TableIconEdit from '@/components/images/TableIconEdit';

interface Client extends Row {
  name: string;
  hourlyRate: number;
  projectCount: number;
}

const ClientsPage: React.FC = () => {
  const [clients] = useState<Client[]>([
    {
      _id: '1',
      name: 'Acme Corporation',
      hourlyRate: 150,
      projectCount: 5,
    },
    {
      _id: '2',
      name: 'Tech Solutions Inc',
      hourlyRate: 175,
      projectCount: 3,
    },
    {
      _id: '3',
      name: 'Global Enterprises',
      hourlyRate: 200,
      projectCount: 8,
    },
    {
      _id: '4',
      name: 'StartUp Ventures',
      hourlyRate: 125,
      projectCount: 2,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');
  const handleEdit = (clientId: string) => {
    const client = clients.find(c => c._id === clientId);
    if (client) {
      toast.info(`Edit mode for: ${client.name}`);
    }
  };

  const handleAddClient = () => {
    toast.info('Open dialog to add new client');
    // In a real app, this would open a dialog form
  };

  const columns: Column[] = [
    {
      accessor: 'name',
      header: 'Client Name',
    },
    {
      accessor: 'hourlyRate',
      header: 'Hourly Rate',
      formatter: (value: number) => `$${value.toFixed(2)}/hr`,
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
          <TableIconEdit />
          <span>Edit</span>
        </button>
      ),
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
          <Button
            variant="primary"
            onClick={handleAddClient}
            className="h-[48px] whitespace-nowrap px-4 ml-4"
          >
            + New Client
          </Button>
        </div>
      )}
      actionPosition="below"
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={false}
      onRetry={() => {
        setHasError(false);
        setIsLoading(false);
      }}
    >
      {/* Empty State */}
      {clients.length === 0 ? (
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
          <Button
            onClick={handleAddClient}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <span>+</span>
            <span>Add Your First Client</span>
          </Button>
        </div>
      ) : (
        <Table
          columns={columns}
          data={clients}
          tableClassName="bg-white rounded-none shadow-none mb-0"
        />
      )}
    </PageLayout>
  );
};

export default ClientsPage;


