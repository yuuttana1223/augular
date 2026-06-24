import { Component, signal } from "@angular/core";
import { ConfirmDialogComponent } from "./confirm-dialog";

@Component({
  selector: "app-delete-demo",
  imports: [ConfirmDialogComponent],
  template: `
    <div class="page">
      <h2>ファイル一覧</h2>
      <ul>
        @for (file of files(); track file) {
          <li>
            {{ file }}
            <button (click)="openDialog(file)">削除</button>
          </li>
        }
      </ul>

      <!-- isOpen と message を input で渡す -->
      <!-- confirmed と cancelled を output で受け取る -->
      <app-confirm-dialog
        [isOpen]="dialogOpen()"
        [message]="'「' + targetFile() + '」を削除しますか？'"
        (confirmed)="onConfirmed()"
        (cancelled)="onCancelled()"
      />

      @if (lastAction()) {
        <p class="log">{{ lastAction() }}</p>
      }
    </div>
  `,
  styles: `
    .page { padding: 24px; font-family: sans-serif; }
    ul { list-style: none; padding: 0; }
    li { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eee; }
    button { padding: 4px 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
    .log { margin-top: 16px; color: #555; font-size: .9rem; }
  `,
})
export class DeleteDemoComponent {
  files = signal(["report.pdf", "photo.jpg", "notes.txt"]);
  dialogOpen = signal(false);
  targetFile = signal("");
  lastAction = signal("");

  openDialog(file: string) {
    this.targetFile.set(file);
    this.dialogOpen.set(true);
  }

  // confirmed は void — $event は使わない。何を削除するかは自分が知っている
  onConfirmed() {
    this.files.update((list) => list.filter((f) => f !== this.targetFile()));
    this.lastAction.set(`「${this.targetFile()}」を削除しました`);
    this.dialogOpen.set(false);
  }

  onCancelled() {
    this.lastAction.set("キャンセルしました");
    this.dialogOpen.set(false);
  }
}
