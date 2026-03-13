import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VendorService, Vendor } from '../../services/vendor';
import { LucideAngularModule, Calendar, MapPin, BadgeCheck, BookOpen, Quote, Landmark, Activity, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './vendor-detail.html',
  styleUrl: './vendor-detail.css',
})
export class VendorDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private vendorService = inject(VendorService);

  vendor: Vendor | null = null;
  isLoading = true;
  error = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadVendor(id);
      } else {
        this.error = 'No Vendor ID provided.';
        this.isLoading = false;
      }
    });
  }

  loadVendor(id: string) {
    this.isLoading = true;
    this.error = '';
    
    this.vendorService.getVendorById(id).subscribe({
      next: (data) => {
        this.vendor = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Vendor Detail Component Error:', err);
        if (err.status === 404 || err.status === 400) {
          this.error = 'Vendor not found.';
        } else {
          this.error = 'Failed to load vendor details. Please try again later.';
        }
        this.isLoading = false;
      }
    });
  }
}
