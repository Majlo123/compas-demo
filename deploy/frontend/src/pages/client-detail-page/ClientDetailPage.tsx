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
import { Trash2, ArrowLeft } from 'lucide-react';
import { getClient, updateClient, getClientProjects } from '@/api/client/client.actions';
import { isApiSuccess } from '@/api/shared.types';

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
  const [clientName, setClientName] = useState<string>('Client');

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
      // Fetch client details
      const clientResponse = await getClient(clientId!);
      if (!isApiSuccess(clientResponse)) {
        setHasError(true);
        setIsLoading(false);
        toast.error(clientResponse.error?.message || 'Failed to load client data');
        return;
      }

      const client = clientResponse.content;
      setClientName(client.name);
      reset({ name: client.name, hourlyRate: client.hourlyRate });

      // Fetch client projects
      const projectsResponse = await getClientProjects(clientId!);
      if (isApiSuccess(projectsResponse)) {
        const projectsData = projectsResponse.content?.data || [];
        const mappedProjects: Project[] = projectsData.map((p: any) => ({
          id: p.id,
          _id: p.id,
          name: p.name,
          description: p.description,
          memberCount: p.memberCount || 0,
        }));
        setProjects(mappedProjects);
      }

      setIsLoading(false);
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
      const response = await updateClient(clientId, { name: data.name, hourlyRate: data.hourlyRate });
      
      if (isApiSuccess(response)) {
        setClientName(data.name);
        toast.success('Client updated successfully');
        reset(data); // Reset form with new values to clear dirty state
      } else {
        toast.error(response.error?.message || 'Failed to update client');
      }
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
        <button
          onClick={() => handleRemoveProject(row.id)}
          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
          title="Remove project"
        >
          <Trash2 size={18} />
        </button>
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

  const clientTitle = clientName || 'Client';

  return (
    <PageLayout 
      title={`Client: ${clientTitle}`}
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
