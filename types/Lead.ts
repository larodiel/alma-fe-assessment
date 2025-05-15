export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedInProfile: string;
  visasOfInterest: string[];
  resumeUrl: string;
  additionalInfo: string;
  status: 'PENDING' | 'REACHED_OUT';
  createdAt: string;
  updatedAt: string;
  country?: string;
};

export type LeadColumn = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  visasOfInterest: string[];
  status: string;
  createdAt: string;
};
