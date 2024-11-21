import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KybService } from '../../services/kyb.service';

@Component({
  selector: 'app-database-verification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-cedar-primary mb-6">Database Verification</h2>

      <!-- Real-time Progress Overlay -->
      <div *ngIf="isLoading" class="fixed inset-0 bg-cedar-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div class="text-center">
            <div class="animate-spin h-12 w-12 border-4 border-cedar-primary rounded-full border-t-transparent mx-auto mb-4"></div>
            <h3 class="text-lg font-semibold text-cedar-primary mb-2">Verifying with Databases</h3>
            <div class="space-y-3">
              <p class="text-cedar-400">{{currentStatus}}</p>
              <div class="w-full bg-cedar-100 rounded-full h-2">
                <div class="bg-cedar-primary h-full rounded-full transition-all duration-500"
                     [style.width]="progress + '%'"></div>
              </div>
              <p class="text-sm text-cedar-400">{{progress}}% Complete</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Verification Results -->
      <div class="space-y-6">
        <!-- KRA Verification -->
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-cedar-50 px-4 py-3 border-b">
            <h3 class="text-lg font-semibold text-cedar-primary">KRA Database Check</h3>
          </div>
          <div class="p-4">
            <div class="flex items-center space-x-2" [ngClass]="{
              'text-green-500': verificationResults?.kra?.status === 'success',
              'text-yellow-500': verificationResults?.kra?.status === 'pending',
              'text-red-500': verificationResults?.kra?.status === 'failed'
            }">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="verificationResults?.kra?.status === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                <path *ngIf="verificationResults?.kra?.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path *ngIf="verificationResults?.kra?.status === 'failed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>{{verificationResults?.kra?.message || 'Checking KRA status...'}}</span>
            </div>
            <div class="mt-2 text-cedar-400">Last Updated: {{verificationResults?.kra?.timestamp | date:'medium'}}</div>
          </div>
        </div>

        <!-- Business Registry -->
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-cedar-50 px-4 py-3 border-b">
            <h3 class="text-lg font-semibold text-cedar-primary">Business Registry Check</h3>
          </div>
          <div class="p-4">
            <div class="flex items-center space-x-2" [ngClass]="{
              'text-green-500': verificationResults?.businessRegistry?.status === 'success',
              'text-yellow-500': verificationResults?.businessRegistry?.status === 'pending',
              'text-red-500': verificationResults?.businessRegistry?.status === 'failed'
            }">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="verificationResults?.businessRegistry?.status === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                <path *ngIf="verificationResults?.businessRegistry?.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path *ngIf="verificationResults?.businessRegistry?.status === 'failed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>{{verificationResults?.businessRegistry?.message || 'Checking business registry...'}}</span>
            </div>
            <div class="mt-2 text-cedar-400">Last Updated: {{verificationResults?.businessRegistry?.timestamp | date:'medium'}}</div>
          </div>
        </div>

        <!-- Tax Compliance -->
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-cedar-50 px-4 py-3 border-b">
            <h3 class="text-lg font-semibold text-cedar-primary">Tax Compliance Status</h3>
          </div>
          <div class="p-4">
            <div class="flex items-center space-x-2" [ngClass]="{
              'text-green-500': verificationResults?.taxCompliance?.status === 'success',
              'text-yellow-500': verificationResults?.taxCompliance?.status === 'pending',
              'text-red-500': verificationResults?.taxCompliance?.status === 'failed'
            }">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="verificationResults?.taxCompliance?.status === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                <path *ngIf="verificationResults?.taxCompliance?.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path *ngIf="verificationResults?.taxCompliance?.status === 'failed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>{{verificationResults?.taxCompliance?.message || 'Checking tax compliance...'}}</span>
            </div>
            <div class="mt-2 text-cedar-400">Last Updated: {{verificationResults?.taxCompliance?.timestamp | date:'medium'}}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DatabaseVerificationComponent {
  isLoading = false;
  progress = 0;
  currentStatus = '';
  verificationResults: any = null;

  private verificationSteps = [
    'Connecting to KRA database...',
    'Verifying business registry...',
    'Checking tax compliance...',
    'Finalizing verification...'
  ];

  constructor(
    private router: Router,
    private kybService: KybService
  ) {}

  onContinue() {
    this.isLoading = true;
    this.progress = 0;
    let currentStep = 0;

    const statusInterval = setInterval(() => {
      if (currentStep < this.verificationSteps.length) {
        this.currentStatus = this.verificationSteps[currentStep];
        currentStep++;
      }
    }, 500);

    this.kybService.verificationProgress$.subscribe(progress => {
      this.progress = progress;
    });

    this.kybService.verifyDatabases().subscribe({
      next: (results) => {
        this.verificationResults = results;
        clearInterval(statusInterval);
        this.router.navigate(['/statement-analysis']);
      },
      error: (error) => {
        clearInterval(statusInterval);
        console.error('Error verifying databases:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
} 