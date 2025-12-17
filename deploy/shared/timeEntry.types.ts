export type TimeEntry = {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  teamName?: string;
  projectName?: string;
  color?: string;
  createdAt?: string | Date;
  [key: string]: any;
};
