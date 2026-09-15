import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss'
})
export class ConfirmationModal {

  @Input()
  visible = false;

  @Input()
  title = 'Confirmation';

  @Input()
  message =
    'Êtes-vous sûr de vouloir continuer ?';

  @Input()
  confirmText = 'Confirmer';

  @Input()
  cancelText = 'Annuler';

  @Input()
  success = false;

  @Output()
  confirmed =
    new EventEmitter<void>();

  @Output()
  cancelled =
    new EventEmitter<void>();

  confirm(): void {

    this.confirmed.emit();
  }

  cancel(): void {

    this.cancelled.emit();
  }
}