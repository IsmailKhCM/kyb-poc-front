import { Routes } from '@angular/router';
import { DocumentVerificationComponent } from './components/document-verification/document-verification.component';
import { InformationExtractionComponent } from './components/information-extraction/information-extraction.component';
import { DatabaseVerificationComponent } from './components/database-verification/database-verification.component';
import { StatementAnalysisComponent } from './components/statement-analysis/statement-analysis.component';
import { VerificationSummaryComponent } from './components/verification-summary/verification-summary.component';

export const routes: Routes = [
  { path: '', redirectTo: 'document-verification', pathMatch: 'full' },
  { path: 'document-verification', component: DocumentVerificationComponent },
  { path: 'information-extraction', component: InformationExtractionComponent },
  { path: 'database-verification', component: DatabaseVerificationComponent },
  { path: 'statement-analysis', component: StatementAnalysisComponent },
  { path: 'summary', component: VerificationSummaryComponent }
];
