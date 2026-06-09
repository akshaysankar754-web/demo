import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  role = localStorage.getItem('role') ?? '';
  isAdmin = this.role === 'Admin';

  logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
}
