import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KybService } from '../../services/kyb.service';

@Component({
  selector: 'app-document-verification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-cedar-primary mb-6">Document Verification</h2>
      
      <!-- Real-time Progress Overlay -->
      <div *ngIf="isVerifying" class="fixed inset-0 bg-cedar-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div class="text-center">
            <div class="animate-spin h-12 w-12 border-4 border-cedar-primary rounded-full border-t-transparent mx-auto mb-4"></div>
            <h3 class="text-lg font-semibold text-cedar-primary mb-2">Verifying Documents</h3>
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

      <!-- Document Upload Section -->
      <div class="space-y-6">
        <!-- Upload Area -->
        <div class="border-2 border-dashed border-cedar-200 rounded-lg p-8 text-center hover:border-cedar-primary transition-colors"
             [class.bg-cedar-50]="isDragging"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          <div class="mb-4">
            <svg class="mx-auto h-12 w-12 text-cedar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <p class="text-cedar-400 mb-2">Drag and drop your documents here, or</p>
          <button 
            (click)="fileInput.click()"
            class="bg-cedar-primary text-white px-6 py-2 rounded-lg hover:bg-cedar-600 transition-colors">
            Browse Files
          </button>
          <input 
            #fileInput
            type="file" 
            class="hidden" 
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            (change)="onFileSelected($event)">
          <p class="text-sm text-cedar-400 mt-2">Supported formats: PDF, JPG, PNG</p>
        </div>

        <!-- Document List -->
        <div class="space-y-4">
          <div *ngFor="let doc of uploadedDocuments" 
               class="flex items-center justify-between p-4 bg-cedar-50 rounded-lg animate-fade-in">
            <div class="flex items-center space-x-4">
              <svg class="h-6 w-6 text-cedar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <div>
                <span class="text-cedar-600 font-medium">{{doc.name}}</span>
                <p class="text-sm text-cedar-400">{{doc.size | number:'1.0-0'}} KB</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span [ngClass]="{
                'text-green-500': doc.status === 'verified',
                'text-yellow-500': doc.status === 'processing',
                'text-red-500': doc.status === 'failed'
              }">{{doc.status | titlecase}}</span>
              <button 
                (click)="removeDocument(doc)"
                class="text-cedar-400 hover:text-red-500 transition-colors">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DocumentVerificationComponent {
  isVerifying = false;
  isDragging = false;
  progress = 0;
  currentStatus = '';
  uploadedDocuments: Array<{
    name: string;
    size: number;
    status: string;
  }> = [];

  private verificationSteps = [
    'Scanning documents...',
    'Checking authenticity...',
    'Validating information...',
    'Finalizing verification...'
  ];

  constructor(
    private router: Router,
    private kybService: KybService
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList) {
    Array.from(files).forEach(file => {
      // Simulate file upload and processing
      const doc = {
        name: file.name,
        size: Math.round(file.size / 1024), // Convert to KB
        status: 'processing'
      };
      
      this.uploadedDocuments.push(doc);
      
      // Simulate processing
      setTimeout(() => {
        doc.status = Math.random() > 0.1 ? 'verified' : 'failed';
      }, 1500);
    });
  }

  removeDocument(doc: any) {
    const index = this.uploadedDocuments.indexOf(doc);
    if (index > -1) {
      this.uploadedDocuments.splice(index, 1);
    }
  }

  onContinue() {
    this.isVerifying = true;
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

    this.kybService.verifyDocuments().subscribe({
      next: () => {
        clearInterval(statusInterval);
        this.router.navigate(['/information-extraction']);
      },
      error: (error) => {
        clearInterval(statusInterval);
        console.error('Error verifying documents:', error);
      },
      complete: () => {
        this.isVerifying = false;
      }
    });
  }
} 