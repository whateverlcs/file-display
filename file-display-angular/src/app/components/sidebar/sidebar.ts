// sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pasta, Subpasta, Arquivo } from '../../models/index';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() pastas: Pasta[] = [];
  @Input() subpastas: Subpasta[] = [];
  @Input() arquivoPrincipal: Arquivo | undefined;

  @Output() onPastaSelecionada = new EventEmitter<Pasta>();
  @Output() onSubpastaSelecionada = new EventEmitter<Subpasta>();
  @Output() onArquivoSelect = new EventEmitter<Arquivo>();
  @Output() onMarkAssistido = new EventEmitter<void>();
  @Output() onRealizarLogout = new EventEmitter<void>();
  @Output() onSidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;
  pastaSelecionadaValue: string = '';
  subpastaSelecionadaValue: string = '';

  onPastaChange() {
    const pasta = this.pastas.find((p) => p.caminho === this.pastaSelecionadaValue);
    if (pasta) {
      this.subpastaSelecionadaValue = '';
      this.onPastaSelecionada.emit(pasta);
    }
  }

  onSubpastaChange() {
    const subpasta = this.subpastas.find((s) => s.caminho === this.subpastaSelecionadaValue);
    if (subpasta) {
      this.onSubpastaSelecionada.emit(subpasta);
    }
  }

  selecionarArquivo(arquivo: Arquivo) {
    this.onArquivoSelect.emit(arquivo);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.onSidebarToggle.emit(this.isCollapsed);
  }

  get arquivosDaSubpasta(): Arquivo[] {
    const subpasta = this.subpastas.find((s) => s.caminho === this.subpastaSelecionadaValue);
    return subpasta ? subpasta.arquivos : [];
  }

  trackByCaminho(index: number, item: Pasta | Subpasta | Arquivo) {
    return item.caminho;
  }

  getIconClasses(arquivo: Arquivo): string {
    const baseClasses = 'w-10 h-10 rounded flex items-center justify-center flex-shrink-0';

    if (arquivo.tipo === 'video') {
      return `${baseClasses} bg-blue-600`;
    } else if (arquivo.tipo === 'pdf') {
      return `${baseClasses} bg-red-600`;
    } else {
      return `${baseClasses} bg-gray-600`;
    }
  }

  emitirMarkAssistido() {
    this.onMarkAssistido.emit();
  }

  emitirRealizarLogout() {
    this.onRealizarLogout.emit();
  }
}
