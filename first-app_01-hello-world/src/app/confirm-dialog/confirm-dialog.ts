import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-confirm-dialog",
  template: `
    @if (isOpen()) {
      <div class="backdrop" (click)="onCancel()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <p>{{ message() }}</p>
          <div class="actions">
            <button (click)="onCancel()">キャンセル</button>
            <button class="danger" (click)="onConfirm()">削除する</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.5);
      display: grid; place-items: center;
    }
    .dialog {
      background: white; border-radius: 8px;
      padding: 24px; min-width: 280px;
    }
    .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
    .danger { background: #e53e3e; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; }
    button { padding: 6px 14px; border-radius: 4px; cursor: pointer; border: 1px solid #ccc; }
  `,
})
export class ConfirmDialogComponent {
  // 親から受け取る
  readonly isOpen = input.required<boolean>();
  readonly message = input<string>("本当に削除しますか？");

  // 親への通知 — どちらも値は不要なので void
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
