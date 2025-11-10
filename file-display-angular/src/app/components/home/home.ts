// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { Arquivo, Pasta, Subpasta, FileChecked } from '../../models/index';
import { MainVideoComponent } from '../main-video/main-video';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MainVideoComponent, SidebarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  arquivoPrincipal: Arquivo | undefined;
  pastas: Pasta[] = [];
  subpastas: Subpasta[] = [];
  pastaSelecionada: Pasta | null = null;
  subpastaSelecionada: Subpasta | null = null;

  constructor(private videoService: VideoService, private router: Router) {}

  ngOnInit(): void {
    this.carregarPastasPrincipais();
  }

  carregarPastasPrincipais() {
    this.videoService.getPastas().subscribe({
      next: (pastas) => {
        this.pastas = pastas;
      },
      error: (err) => {
        console.error('Erro ao carregar pastas:', err);
      },
    });
  }

  onPastaSelecionada(pasta: Pasta) {
    this.pastaSelecionada = pasta;
    this.subpastas = [];
    this.subpastaSelecionada = null;
    this.arquivoPrincipal = undefined;

    this.videoService.getSubpastas(pasta.caminho).subscribe({
      next: (subpastas) => {
        this.subpastas = subpastas;
      },
      error: (err) => {
        console.error('Erro ao carregar subpastas:', err);
      },
    });
  }

  onSubpastaSelecionada(subpasta: Subpasta) {
    this.subpastaSelecionada = subpasta;
    this.arquivoPrincipal = undefined;
  }

  mudarArquivo(arquivo: Arquivo) {
    this.arquivoPrincipal = arquivo;
  }

  marcarComoAssistido() {
    if (!this.pastaSelecionada) {
      alert('Selecione uma pasta principal primeiro');
      return;
    }

    if (!this.subpastaSelecionada) {
      alert('Selecione uma subpasta');
      return;
    }

    if (!this.arquivoPrincipal) {
      alert('Nenhum arquivo selecionado para exibição');
      return;
    }

    const tipo = this.arquivoPrincipal.tipo === 'video' ? 'video' : 'pdf';

    const payload: FileChecked = {
      PastaPrincipal: this.pastaSelecionada.caminho,
      Tipo: tipo,
      ArquivoOuSubpasta: tipo === 'video' ? this.arquivoPrincipal.nome : '',
      Subpasta: tipo === 'pdf' ? this.subpastaSelecionada!.nome : '',
    };

    this.videoService.postChecked(payload).subscribe({
      next: (response) => {
        alert(response.message);
      },
      error: (err) => {
        alert('Erro ao marcar como assistido');
      },
    });
  }

  realizarLogout() {
    localStorage.removeItem('autenticado');
    this.router.navigate(['/login']);
  }

  onSidebarToggle(isCollapsed: boolean) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 350);
  }
}
