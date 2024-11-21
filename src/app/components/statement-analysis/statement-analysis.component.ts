import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KybService } from '../../services/kyb.service';
import { StatementAnalysis } from '../../models/kyb.types';

@Component({
  selector: 'app-statement-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-cedar-primary mb-6">Statement Analysis</h2>

      <!-- Processing Status -->
      <div *ngIf="isProcessing" class="fixed inset-0 bg-cedar-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div class="text-center">
            <div class="animate-spin h-12 w-12 border-4 border-cedar-primary rounded-full border-t-transparent mx-auto mb-4"></div>
            <h3 class="text-lg font-semibold text-cedar-primary mb-2">Analyzing Financial Data</h3>
            <div class="space-y-3">
              <p class="text-cedar-400">{{currentStatus}}</p>
              <div class="w-full bg-cedar-100 rounded-full h-2">
                <div class="bg-cedar-primary h-full rounded-full transition-all duration-500"
                     [style.width]="progressPercentage + '%'"></div>
              </div>
              <p class="text-sm text-cedar-400">{{progressPercentage}}% Complete</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Content -->
      <div class="space-y-8">
        <!-- Statement Upload Section -->
        <div *ngIf="!analysisResults" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- M-Pesa Statement -->
          <div class="border rounded-lg p-6">
            <h3 class="text-lg font-semibold text-cedar-primary mb-4">M-Pesa Statement</h3>
            <div class="border-2 border-dashed border-cedar-200 rounded-lg p-6 text-center">
              <svg class="mx-auto h-12 w-12 text-cedar-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-cedar-400 mb-2">Upload your M-Pesa statement</p>
              <button 
                (click)="onUploadMpesa()"
                class="bg-cedar-primary text-white px-4 py-2 rounded-lg hover:bg-cedar-600 transition-colors">
                Choose File
              </button>
            </div>
          </div>

          <!-- Bank Statement -->
          <div class="border rounded-lg p-6">
            <h3 class="text-lg font-semibold text-cedar-primary mb-4">Bank Statement</h3>
            <div class="border-2 border-dashed border-cedar-200 rounded-lg p-6 text-center">
              <svg class="mx-auto h-12 w-12 text-cedar-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-cedar-400 mb-2">Upload your bank statement</p>
              <button 
                (click)="onUploadBank()"
                class="bg-cedar-primary text-white px-4 py-2 rounded-lg hover:bg-cedar-600 transition-colors">
                Choose File
              </button>
            </div>
          </div>
        </div>

        <!-- Analysis Results -->
        <div *ngIf="analysisResults" class="space-y-6 animate-fade-in">
          <!-- Key Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-cedar-50 to-white p-6 rounded-xl shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-cedar-400 text-sm">Monthly Income</h4>
                <svg class="h-5 w-5 text-cedar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-2xl font-bold text-cedar-primary">{{analysisResults.monthlyIncome}}</p>
              <p class="text-sm text-green-500 mt-2">+12.5% vs Last Month</p>
            </div>

            <div class="bg-gradient-to-br from-cedar-50 to-white p-6 rounded-xl shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-cedar-400 text-sm">Transaction Volume</h4>
                <svg class="h-5 w-5 text-cedar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <p class="text-2xl font-bold text-cedar-primary">{{analysisResults.transactionVolume}}</p>
              <p class="text-sm text-cedar-400 mt-2">Last 30 Days</p>
            </div>

            <div class="bg-gradient-to-br from-cedar-50 to-white p-6 rounded-xl shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-cedar-400 text-sm">Risk Score</h4>
                <svg class="h-5 w-5" [ngClass]="{
                  'text-green-500': analysisResults.riskScore === 'Low',
                  'text-yellow-500': analysisResults.riskScore === 'Medium',
                  'text-red-500': analysisResults.riskScore === 'High'
                }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-2xl font-bold" [ngClass]="{
                'text-green-500': analysisResults.riskScore === 'Low',
                'text-yellow-500': analysisResults.riskScore === 'Medium',
                'text-red-500': analysisResults.riskScore === 'High'
              }">{{analysisResults.riskScore}}</p>
              <p class="text-sm text-cedar-400 mt-2">Based on 12 factors</p>
            </div>
          </div>

          <!-- Business Analysis -->
          <div class="border rounded-lg overflow-hidden">
            <div class="bg-cedar-50 px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-cedar-primary">Business Pattern Analysis</h3>
            </div>
            <div class="p-6 space-y-4">
              <!-- Transaction Pattern -->
              <div class="flex items-center justify-between p-4 bg-cedar-50 rounded-lg">
                <div>
                  <p class="font-medium text-cedar-600">Regular Business Payments</p>
                  <p class="text-sm text-cedar-400 mt-1">Consistent monthly transactions detected</p>
                </div>
                <div class="flex items-center space-x-2 text-green-500">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Verified</span>
                </div>
              </div>

              <!-- Business Category -->
              <div class="flex items-center justify-between p-4 bg-cedar-50 rounded-lg">
                <div>
                  <p class="font-medium text-cedar-600">Business Category</p>
                  <p class="text-sm text-cedar-400 mt-1">{{analysisResults.businessCategory}}</p>
                </div>
                <div class="text-cedar-primary">
                  <span class="px-3 py-1 bg-cedar-100 rounded-full text-sm">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StatementAnalysisComponent {
  isProcessing = false;
  analysisResults: StatementAnalysis | null = null;
  progressPercentage = 0;
  currentStatus = 'Initializing analysis...';

  private analysisSteps = [
    'Loading financial statements...',
    'Analyzing transaction patterns...',
    'Calculating risk metrics...',
    'Verifying business category...',
    'Generating final report...'
  ];

  constructor(
    private router: Router,
    private kybService: KybService
  ) {}

  simulateProgress() {
    let step = 0;
    const interval = setInterval(() => {
      if (step < this.analysisSteps.length) {
        this.currentStatus = this.analysisSteps[step];
        this.progressPercentage = Math.min(100, ((step + 1) / this.analysisSteps.length) * 100);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  onUploadMpesa() {
    // Simulate file upload
    setTimeout(() => {
      // Handle upload success
    }, 1000);
  }

  onUploadBank() {
    // Simulate file upload
    setTimeout(() => {
      // Handle upload success
    }, 1000);
  }

  onAnalyze() {
    this.isProcessing = true;
    this.progressPercentage = 0;
    this.simulateProgress();

    this.kybService.analyzeStatements().subscribe({
      next: (results) => {
        this.analysisResults = results;
      },
      error: (error) => {
        console.error('Error analyzing statements:', error);
        // Handle error appropriately
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  onComplete() {
    this.router.navigate(['/summary']);
  }
} 