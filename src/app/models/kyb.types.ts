export interface CompanyDetails {
  name: string;
  registrationNumber: string;
  registrationDate: string;
  status: string;
}

export interface DirectorInfo {
  name: string;
  idNumber: string;
  shareholding: string;
}

export interface VerificationResult {
  status: 'success' | 'pending' | 'failed';
  message: string;
  timestamp: string;
}

export interface StatementAnalysis {
  monthlyIncome: string;
  transactionVolume: number;
  riskScore: 'Low' | 'Medium' | 'High';
  businessCategory: string;
}

export interface KYBSummary {
  companyDetails: CompanyDetails;
  directorInfo: DirectorInfo;
  verificationResults: {
    documents: VerificationResult;
    kra: VerificationResult;
    businessRegistry: VerificationResult;
    taxCompliance: VerificationResult;
  };
  statementAnalysis: StatementAnalysis;
  overallStatus: 'Approved' | 'Rejected' | 'Pending';
  verificationDate: string;
} 