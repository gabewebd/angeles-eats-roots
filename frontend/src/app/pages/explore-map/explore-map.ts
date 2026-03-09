import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Filter, Coffee, Home } from 'lucide-angular';

@Component({
  selector: 'app-explore-map',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './explore-map.html',
  styleUrl: './explore-map.css',
})
export class ExploreMap {
  markers = [
    { type: 'heritage', icon: 'home', colorClasses: 'bg-angeles-blue text-white shadow-blue-900/40', top: '25%', left: '65%' },
    { type: 'eatery', icon: 'coffee', colorClasses: 'bg-angeles-red text-white shadow-red-900/40', top: '35%', left: '42%' },
    { type: 'eatery', icon: 'coffee', colorClasses: 'bg-angeles-red text-white shadow-red-900/40', top: '45%', left: '25%' },
    { type: 'eatery', icon: 'coffee', colorClasses: 'bg-angeles-red text-white shadow-red-900/40', top: '53%', left: '55%' },
    { type: 'heritage', icon: 'home', colorClasses: 'bg-angeles-blue text-white shadow-blue-900/40', top: '60%', left: '33%' },
    { type: 'eatery', icon: 'coffee', colorClasses: 'bg-angeles-red text-white shadow-red-900/40', top: '68%', left: '72%' }
  ];
}
