import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { CompanyDetails, DirectorInfo, VerificationResult, StatementAnalysis, KYBSummary } from '../models/kyb.types';

@Injectable({
  providedIn: 'root'
})
export class KybService {
  private verificationProgress = new BehaviorSubject<number>(0);
  verificationProgress$ = this.verificationProgress.asObservable();

  private mockData: KYBSummary = {
    companyDetails: {
      name: 'Cedar Technologies Ltd',
      registrationNumber: 'KYB-123456',
      registrationDate: '2024-01-01',
      status: 'Active'
    },
    directorInfo: {
      name: 'John Doe',
      idNumber: '12345678',
      shareholding: '60%'
    },
    verificationResults: {
      documents: {
        status: 'success',
        message: 'All documents verified successfully',
        timestamp: '2024-03-20T10:00:00Z'
      },
      kra: {
        status: 'success',
        message: 'KRA PIN active and valid',
        timestamp: '2024-03-20T10:05:00Z'
      },
      businessRegistry: {
        status: 'success',
        message: 'Business registration confirmed',
        timestamp: '2024-03-20T10:10:00Z'
      },
      taxCompliance: {
        status: 'pending',
        message: 'Tax compliance verification in progress',
        timestamp: '2024-03-20T10:15:00Z'
      }
    },
    statementAnalysis: {
      monthlyIncome: 'KES 450,000',
      transactionVolume: 234,
      riskScore: 'Low',
      businessCategory: 'Technology Services'
    },
    overallStatus: 'Pending',
    verificationDate: '2024-03-20'
  };

  private simulateProgress(duration: number, steps: number = 10) {
    const interval = duration / steps;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      this.verificationProgress.next((currentStep / steps) * 100);
      
      if (currentStep === steps) {
        clearInterval(progressInterval);
      }
    }, interval);
  }

  verifyDocuments(): Observable<VerificationResult> {
    this.verificationProgress.next(0);
    return of({
      status: 'success' as const,
      message: 'Documents verified successfully',
      timestamp: new Date().toISOString()
    }).pipe(
      tap(() => this.simulateProgress(2000)),
      delay(2000)
    );
  }

  extractInformation(): Observable<{ company: CompanyDetails; director: DirectorInfo }> {
    this.verificationProgress.next(0);
    return of({
      company: this.mockData.companyDetails,
      director: this.mockData.directorInfo
    }).pipe(
      tap(() => this.simulateProgress(2000)),
      delay(2000)
    );
  }

  verifyDatabases(): Observable<{
    kra: VerificationResult;
    businessRegistry: VerificationResult;
    taxCompliance: VerificationResult;
  }> {
    this.verificationProgress.next(0);
    return of({
      kra: this.mockData.verificationResults.kra,
      businessRegistry: this.mockData.verificationResults.businessRegistry,
      taxCompliance: this.mockData.verificationResults.taxCompliance
    }).pipe(
      tap(() => this.simulateProgress(3000)),
      delay(3000)
    );
  }

  analyzeStatements(): Observable<StatementAnalysis> {
    this.verificationProgress.next(0);
    return of(this.mockData.statementAnalysis).pipe(
      tap(() => this.simulateProgress(2500)),
      delay(2500)
    );
  }

  getSummary(): Observable<KYBSummary> {
    this.verificationProgress.next(0);
    return of(this.mockData).pipe(
      tap(() => this.simulateProgress(1500)),
      delay(1500)
    );
  }
} 