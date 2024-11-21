import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KybService } from '../../services/kyb.service';

@Component({
  selector: 'app-information-extraction',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-cedar-primary mb-6">Information Extraction</h2>

      <!-- Real-time Progress Overlay -->
      <div *ngIf="isLoading" class="fixed inset-0 bg-cedar-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div class="text-center">
            <div class="animate-spin h-12 w-12 border-4 border-cedar-primary rounded-full border-t-transparent mx-auto mb-4"></div>
            <h3 class="text-lg font-semibold text-cedar-primary mb-2">Extracting Information</h3>
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

      <!-- Extracted Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-cedar-primary">Company Details</h3>
          <div class="space-y-2">
            <div class="p-3 bg-cedar-50 rounded-lg">
              <p class="text-sm text-cedar-400">Company Name</p>
              <p class="text-cedar-600 font-medium">{{extractedInfo?.company?.name || 'Extracting...'}}</p>
            </div>
            <div class="p-3 bg-cedar-50 rounded-lg">
              <p class="text-sm text-cedar-400">Registration Number</p>
              <p class="text-cedar-600 font-medium">{{extractedInfo?.company?.registrationNumber || 'Extracting...'}}</p>
            </div>
            <div class="p-3 bg-cedar-50 rounded-lg">
              <p class="text-sm text-cedar-400">Date of Registration</p>
              <p class="text-cedar-600 font-medium">
                {{extractedInfo?.company?.registrationDate ? (extractedInfo.company.registrationDate | date) : 'Extracting...'}}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-cedar-primary">Director Information</h3>
          <div class="space-y-2">
            <div class="p-3 bg-cedar-50 rounded-lg">
              <p class="text-sm text-cedar-400">Director Name</p>
              <p class="text-cedar-600 font-medium">{{extractedInfo?.director?.name || 'Extracting...'}}</p>
            </div>
            <div class="p-3 bg-cedar-50 rounded-lg">
              <p class="text-sm text-cedar-400">ID Number</p>
              <p class="text-cedar-600 font-medium">{{extractedInfo?.director?.idNumber || 'Extracting...'}}</p>
            </div>
            <div class="p-3 bg-cedar-50 rounded-lg">
              <p class="text-sm text-cedar-400">Shareholding</p>
              <p class="text-cedar-600 font-medium">{{extractedInfo?.director?.shareholding || 'Extracting...'}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InformationExtractionComponent {
  isLoading = false;
  progress = 0;
  currentStatus = '';
  extractedInfo: any = null;

  private extractionSteps = [
    'Reading document content...',
    'Identifying key information...',
    'Validating extracted data...',
    'Finalizing extraction...'
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
      if (currentStep < this.extractionSteps.length) {
        this.currentStatus = this.extractionSteps[currentStep];
        currentStep++;
      }
    }, 500);

    this.kybService.verificationProgress$.subscribe(progress => {
      this.progress = progress;
    });

    this.kybService.extractInformation().subscribe({
      next: (info) => {
        this.extractedInfo = info;
        clearInterval(statusInterval);
        this.router.navigate(['/database-verification']);
      },
      error: (error) => {
        clearInterval(statusInterval);
        console.error('Error extracting information:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
} 