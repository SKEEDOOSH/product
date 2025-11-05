import { Component, OnInit } from '@angular/core';
import { MenuService } from '../service/menu.service';
import { Menu } from '../model/menu';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public menus: Menu[] = [];

  constructor(
    private menuService: MenuService,
    public authService: AuthService, // Made public to use in template
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuService.getData().subscribe(data => {
      this.menus = data;
    });
  }

  // Logout method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // redirect to homepage
  }
}
