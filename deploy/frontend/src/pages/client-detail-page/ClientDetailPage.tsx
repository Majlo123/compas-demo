import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import FormTextInput from '@/components/controls/FormTextInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import DeleteButton from '@/components/controls/button/DeleteButton';

interface Project extends Row {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
}

const clientFormSchema = z.object({
  name: z.string().min(1, 'Client name is required.'),
  hourlyRate: z.preprocess((val) => {
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isNaN(n) ? val : n;
    }
    return val;
  }, z.number({ invalid_type_error: 'Hourly rate must be a number.' }).positive('Enter a valid hourly rate greater than 0.')),
});

type ClientForm = z.infer<typeof clientFormSchema>;

const ClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { name: '', hourlyRate: 0 },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!clientId) {
      navigate('/clients');
      return;
    }
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // TODO: Replace with actual API call
      // Simulating API call with mock data
      setTimeout(() => {
        // Mock client data
        const mockClient = {
          _id: clientId,
          name: 'Acme Corporation',
          hourlyRate: 150,
        };
        
        // Mock projects data
        const mockProjects: Project[] = [
          {
            id: '1',
            _id: '1',
            name: 'Website Redesign',
            description: 'Complete website overhaul',
            memberCount: 5,
          },
          {
            id: '2',
            _id: '2',
            name: 'Mobile App Development',
            description: 'iOS and Android apps',
            memberCount: 8,
          },
          {
            id: '3',
            _id: '3',
            name: 'API Integration',
            description: 'Third-party API integration',
            memberCount: 3,
          },
        ];
        
        reset({ name: mockClient.name, hourlyRate: mockClient.hourlyRate });
        setProjects(mockProjects);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setHasError(true);
      setIsLoading(false);
      toast.error('Failed to load client data');
    }
  };

  const onSaveClient = async (data: ClientForm) => {
    if (!clientId) return;
    
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Client updated successfully');
      reset(data); // Reset form with new values to clear dirty state
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Frontend-only removal (no API call as per requirements)
    setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
    toast.success(`Project "${project.name}" removed from client`);
  };

  const handleAddExistingProject = () => {
    toast.info('Add Existing Project feature coming soon');
    // TODO: Open a dialog to select and add existing projects
  };

  const columns: Column[] = [
    {
      accessor: 'name',
      header: 'Project Name',
    },
    {
      accessor: 'description',
      header: 'Description',
    },
    {
      accessor: 'memberCount',
      header: 'Members',
    },
    {
      accessor: 'actions',
      header: 'Actions',
      formatter: (_value: any, row: any) => (
        <DeleteButton
          onClick={() => handleRemoveProject(row.id)}
          title="Remove project"
          size="md"
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <PageLayout 
        title="Loading..." 
        isLoading={true}
        hasError={false}
        isEmpty={false}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading client details...</div>
        </div>
      </PageLayout>
    );
  }

  if (hasError) {
    return (
      <PageLayout 
        title="Error"
        isLoading={false}
        hasError={true}
        isEmpty={false}
        onRetry={fetchClientData}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Failed to load client data</div>
        </div>
      </PageLayout>
    );
  }

  const clientName = control._formValues.name || 'Client';

  return (
    <PageLayout 
      title={`Client: ${clientName}`}
      isLoading={false}
      hasError={false}
      isEmpty={false}
    >
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/clients')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Clients</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Client Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Details</h2>
          <form onSubmit={handleSubmit(onSaveClient)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormTextInput
                  name="name"
                  control={control}
                  errors={errors}
                  type="text"
                  inputClassName="w-full"
                  placeholder="Enter client name"
                  label="Client Name"
                  required
                />
              </div>
              <div>
                <FormTextInput
                  name="hourlyRate"
                  control={control}
                  errors={errors}
                  type="number"
                  inputMode="decimal"
                  inputClassName="w-full"
                  placeholder="Enter hourly rate"
                  label="Hourly Rate ($)"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={!isDirty || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Assigned Projects</h2>
            <Button 
              onClick={handleAddExistingProject}
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <span>+</span>
              <span>Add Existing Project</span>
            </Button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Assigned</h3>
              <p className="text-gray-500 mb-6">
                Add existing projects to this client to get started.
              </p>
              <Button
                onClick={handleAddExistingProject}
                variant="primary"
                className="inline-flex items-center gap-2"
              >
                <span>+</span>
                <span>Add Your First Project</span>
              </Button>
            </div>
          ) : (
            <Table
              columns={columns}
              data={projects}
              tableClassName="bg-white rounded-none shadow-none mb-0"
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ClientDetailPage;
