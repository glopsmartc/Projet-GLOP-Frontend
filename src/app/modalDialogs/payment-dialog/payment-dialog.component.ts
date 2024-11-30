import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatInputModule],
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent {
  isLoading = false;
  isCvcPreviewVisible = false;  // This will control the visibility of the CVC preview

  @Output() paymentConfirmed: EventEmitter<boolean> = new EventEmitter();
  
  selectedPlan: any;
  constructor(private dialogRef: MatDialogRef<PaymentDialogComponent>, private router: Router) {}

  ngOnInit(): void {
    let state = this.router.getCurrentNavigation()?.extras.state;
    if (!state) {
      state = history.state; // Fallback to history state if Angular state is not available

    }

    if (state && state['selectedPlan']) {
      this.selectedPlan = state['selectedPlan'];
      console.log('Données de l\'offre:', this.selectedPlan);
    } else {
      console.error('State or required data is not available');
      // this.router.navigate(['/error-page']);
    }
  }
  

  onPayClick() {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);

    setTimeout(() => {
      // Emit the event to notify the parent component that the payment has been confirmed
      this.paymentConfirmed.emit();
      this.dialogRef.close()
    }, 3000);
  } 

  onCancel() {
    this.dialogRef.close('cancel');
  }

  toggleCvcPreview() {
    this.isCvcPreviewVisible = !this.isCvcPreviewVisible;
  }
}
