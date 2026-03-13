import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Settings, Heart, Bookmark, MapPin, LogOut, ChevronRight, Star, Loader } from 'lucide-angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  readonly settings = Settings;
  readonly heart = Heart;
  readonly bookmark = Bookmark;
  readonly mapPin = MapPin;
  readonly logOut = LogOut;
  readonly chevronRight = ChevronRight;
  readonly star = Star;
  readonly loader = Loader;

  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(true);

  // Profile data with fallback defaults
  profile = signal({
    name: 'Guest User',
    initials: 'GU',
    memberSince: '2024',
    badge: 'Community Explorer',
    visited: 0,
    saved: 0,
    reviews: 0,
    pendingSubmissions: 0
  });

  ngOnInit() {
    // Attempt to load profile from localStorage admin token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.profile.set({
          name: payload.username || payload.name || 'Admin User',
          initials: this.getInitials(payload.username || payload.name || 'Admin User'),
          memberSince: '2024',
          badge: 'Community Contributor',
          visited: 23,
          saved: 15,
          reviews: 8,
          pendingSubmissions: 2
        });
      } catch (e) {
        console.error('Audit [Profile]: Token decode failure', e);
      }
    }
    this.loading.set(false);
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
