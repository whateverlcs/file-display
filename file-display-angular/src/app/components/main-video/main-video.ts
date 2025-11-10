// main-video.component.ts
import { Component, Input, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Arquivo } from '../../models/index';
import { VideoService } from '../../services/video.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-main-video',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './main-video.html',
  styleUrls: ['./main-video.css'],
})
export class MainVideoComponent implements OnChanges {
  @Input() arquivo!: Arquivo;

  pdfSrc: string = '';
  isLoaded: boolean = false;

  constructor(private videoService: VideoService) {}

  ngOnChanges() {
    if (this.arquivo && this.isPdf()) {
      this.carregarPDF();
    } else if (this.arquivo && this.isVideo()) {
      this.isLoaded = true;
    }
  }

  carregarPDF() {
    this.isLoaded = false;
    this.pdfSrc = this.getArquivoUrl();
  }

  afterLoadComplete(pdf: any) {
    this.isLoaded = true;
  }

  onError(error: any) {
    this.isLoaded = true;
  }

  @HostListener('window:resize')
  onResize() {
    // O PDF viewer vai se redimensionar automaticamente quando o window.resize for disparado
  }

  getArquivoUrl(): string {
    return this.arquivo ? this.videoService.getArquivoUrl(this.arquivo) : '';
  }

  isVideo(): boolean {
    return this.arquivo?.tipo === 'video';
  }

  isPdf(): boolean {
    return this.arquivo?.tipo === 'pdf';
  }
}
