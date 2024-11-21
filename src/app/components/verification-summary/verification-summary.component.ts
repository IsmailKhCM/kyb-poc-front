import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KybService } from '../../services/kyb.service';
import { KYBSummary } from '../../models/kyb.types';

@Component({
  selector: 'app-verification-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center p-8">
        <div class="animate-spin h-8 w-8 border-4 border-cedar-primary rounded-full border-t-transparent"></div>
      </div>

      <ng-container *ngIf="!isLoading && summary">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-cedar-primary">Verification Summary</h2>
          <div [ngClass]="[
            'px-4 py-2 rounded-full text-sm font-semibold',
            summary.overallStatus === 'Approved' ? 'bg-green-100 text-green-800' :
            summary.overallStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          ]">
            {{summary.overallStatus}}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Company Information -->
          <div class="space-y-6">
            <div class="bg-cedar-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-cedar-primary mb-4">Company Details</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-cedar-400">Company Name</p>
                  <p class="font-medium text-cedar-600">{{summary.companyDetails.name}}</p>
                </div>
                <div>
                  <p class="text-sm text-cedar-400">Registration Number</p>
                  <p class="font-medium text-cedar-600">{{summary.companyDetails.registrationNumber}}</p>
                </div>
                <div>
                  <p class="text-sm text-cedar-400">Registration Date</p>
                  <p class="font-medium text-cedar-600">{{summary.companyDetails.registrationDate | date}}</p>
                </div>
              </div>
            </div>

            <div class="bg-cedar-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-cedar-primary mb-4">Statement Analysis</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-cedar-400">Monthly Income</p>
                  <p class="font-medium text-cedar-600">{{summary.statementAnalysis.monthlyIncome}}</p>
                </div>
                <div>
                  <p class="text-sm text-cedar-400">Risk Score</p>
                  <p class="font-medium" [ngClass]="{
                    'text-green-600': summary.statementAnalysis.riskScore === 'Low',
                    'text-yellow-600': summary.statementAnalysis.riskScore === 'Medium',
                    'text-red-600': summary.statementAnalysis.riskScore === 'High'
                  }">{{summary.statementAnalysis.riskScore}}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Verification Results -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-cedar-primary">Verification Results</h3>
            <div class="space-y-3">
              <div *ngFor="let result of verificationResults" class="flex items-center justify-between p-4 bg-cedar-50 rounded-lg">
                <span class="text-cedar-600">{{result.name}}</span>
                <div class="flex items-center space-x-2" [ngClass]="{
                  'text-green-500': result.status === 'success',
                  'text-yellow-500': result.status === 'pending',
                  'text-red-500': result.status === 'failed'
                }">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path *ngIf="result.status === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    <path *ngIf="result.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path *ngIf="result.status === 'failed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>{{result.status | titlecase}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class VerificationSummaryComponent implements OnInit {
  summary: KYBSummary | null = null;
  verificationResults: Array<{ name: string; status: 'success' | 'pending' | 'failed' }> = [];
  isLoading = false;

  constructor(private kybService: KybService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.kybService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.verificationResults = [
          { name: 'Document Verification', status: summary.verificationResults.documents.status },
          { name: 'KRA Check', status: summary.verificationResults.kra.status },
          { name: 'Business Registry', status: summary.verificationResults.businessRegistry.status },
          { name: 'Tax Compliance', status: summary.verificationResults.taxCompliance.status }
        ];
      },
      error: (error) => {
        console.error('Error fetching summary:', error);
        // Handle error appropriately
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onStartNew() {
    this.router.navigate(['/document-verification']);
  }
} 