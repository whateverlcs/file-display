// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  usuario: string = '';
  senha: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.usuario === '' && this.senha === '') {
      //Defina um login e senha para entrar no sistema
      localStorage.setItem('autenticado', 'true');
      this.router.navigate(['/home']);
    } else {
      alert('Usuário ou senha inválidos');
    }
  }
}
