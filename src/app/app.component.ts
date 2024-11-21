import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Cedar KYB Demo';
  currentStep = 1;
  
  steps = [
    { number: 1, title: 'Document Verification', route: 'document-verification' },
    { number: 2, title: 'Information Extraction', route: 'information-extraction' },
    { number: 3, title: 'Database Verification', route: 'database-verification' },
    { number: 4, title: 'Statement Analysis', route: 'statement-analysis' },
    { number: 5, title: 'Summary', route: 'summary' }
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateCurrentStep(event.url);
    });
  }

  private updateCurrentStep(url: string) {
    const step = this.steps.find(s => url.includes(s.route));
    if (step) {
      this.currentStep = step.number;
    }
  }

  isStepComplete(stepNumber: number): boolean {
    return stepNumber < this.currentStep;
  }

  isCurrentStep(stepNumber: number): boolean {
    return stepNumber === this.currentStep;
  }

  navigateToStep(stepNumber: number) {
    if (stepNumber > 0 && stepNumber <= this.steps.length && 
        (stepNumber <= this.currentStep || stepNumber === this.currentStep + 1)) {
      this.router.navigate([this.steps[stepNumber - 1].route]);
    }
  }
}
