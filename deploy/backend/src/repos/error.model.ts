import createBaseRepository from 'repos/utils/baseRepository';

// Simple placeholder type representing an application error record.
// Extend or modify this type based on your requirements.
export type ErrorRecord = {
  id?: string;
  message: string;
  stack: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const { create } = createBaseRepository<ErrorRecord>('errors');

export { create };
