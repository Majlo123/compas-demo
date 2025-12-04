import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/controls/button/Button';
import CustomDialog from '@/components/dialog/dialog-props';
import FormTextInput from '@/components/controls/FormTextInput';
import Checkbox from '@/components/controls/Checkbox';
import { searchUsers } from '@/api/user/user.actions';
import { bulkAddTeamMembers } from '@/api/team/team.actions';
import { isApiSuccess } from '@/api/shared.types';
import { useDebounce } from 'use-debounce';
import { useParams } from 'react-router-dom';
import { User } from '@/api/user/user.types';

interface FormData {
  searchQuery: string;
}

interface DialogTeamDetailsFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { userId: string; isManager: boolean }) => Promise<void>;
  onSuccess?: () => void;
}

const DialogTeamDetailsForm: React.FC<DialogTeamDetailsFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  onSuccess,
}) => {
  const { teamId } = useParams<{ teamId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedUsersData, setSelectedUsersData] = useState<Map<string, User>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      searchQuery: '',
    },
  });

  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = debouncedSearchQuery.replace(/\s+/g, '');
      
      if (!trimmedQuery || trimmedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchUsers(trimmedQuery);
        if (isApiSuccess(response)) {
          setSearchResults(response.content);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
        setSelectedUsersData(prevData => {
          const newData = new Map(prevData);
          newData.delete(userId);
          return newData;
        });
      } else {
        newSet.add(userId);
        const user = searchResults.find(u => u.id === userId);
        if (user) {
          setSelectedUsersData(prevData => new Map(prevData).set(userId, user));
        }
      }
      return newSet;
    });
  };

  const handleSubmit = handleFormSubmit(async () => {
    if (selectedUsers.size === 0) {
      setError('Please select at least one user');
      return;
    }

    if (!teamId) {
      setError('Team ID is missing');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const members = Array.from(selectedUsers).map(userId => ({
        userId,
        isManager: false
      }));

      const response = await bulkAddTeamMembers(teamId, members);
      
      if (isApiSuccess(response)) {
        // Call the original onSubmit for any additional logic
        await onSubmit({
          userId: Array.from(selectedUsers)[0],
          isManager: false,
        });

        // Reset form on success
        reset();
        setSelectedUsers(new Set());
        setSelectedUsersData(new Map());
        setSearchResults([]);
        setSearchQuery('');
        onOpenChange(false);

        // Refresh parent data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError('Failed to add users to team');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add users');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => {
    reset();
    setError('');
    setSelectedUsers(new Set());
    setSelectedUsersData(new Map());
    setSearchResults([]);
    setSearchQuery('');
    onOpenChange(false);
  };
  
  // Stores full user data for selected users so they remain visible even when search results change
  const getSelectedUsersList = () => {
    return Array.from(selectedUsers).map(userId => selectedUsersData.get(userId)).filter(Boolean) as User[];
  };

  return (
    <CustomDialog
      title="Add Users to Team"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormTextInput
          name="searchQuery"
          label="Find User"
          control={control}
          errors={errors}
          placeholder="Search by name or email..."
          disabled={isSubmitting}
          required={false}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Search Results */}
        {isSearching && (
          <div className="text-gray-500 text-sm">Searching...</div>
        )}

        {searchResults.length > 0 && !isSearching && (
          <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
            <p className="text-sm font-semibold mb-2 text-gray-700">Search Results:</p>
            {searchResults.map(user => (
              <label
                key={user.id}
                className="flex items-center gap-3 py-2 hover:bg-gray-50 px-2 rounded cursor-pointer"
              >
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedUsers.has(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.fullName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Selected Users */}
        {selectedUsers.size > 0 && (
          <div className="border border-blue-300 bg-blue-50 rounded-lg p-3">
            <p className="text-sm font-semibold mb-2 text-blue-900">
              Selected Users ({selectedUsers.size}):
            </p>
            <div className="space-y-1">
              {getSelectedUsersList().map(user => (
                <div key={user.id} className="flex items-center justify-between text-sm py-1">
                  <span className="font-medium">{user.fullName}</span>
                  <button
                    type="button"
                    onClick={() => handleUserToggle(user.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red text-sm">{error}</p>}

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || selectedUsers.size === 0}
          >
            {isSubmitting ? 'Adding...' : 'Confirm'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogTeamDetailsForm;
