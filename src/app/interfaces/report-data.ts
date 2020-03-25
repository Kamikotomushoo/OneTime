
export interface IReportData {
  id?: number;
  creatorEmail?: string;
  name?: string;
  description?: string;
  time?: number;
  overtime?: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface IReportOfUser {
  reportId: number;
  userId: number;
}


