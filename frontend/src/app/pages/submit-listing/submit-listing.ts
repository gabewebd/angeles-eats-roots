import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LucideAngularModule, Camera, Store, Clock, BookOpen, Heart, ShieldCheck, Sparkles, X, Plus, Trash2, Check, Loader, Landmark } from 'lucide-angular';
import { SubmissionService } from '../../services/submission';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-listing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './submit-listing.html',
  styleUrl: './submit-listing.css',
})
export class SubmitListing implements OnInit {
  private fb = inject(FormBuilder);
  private submissionService = inject(SubmissionService);
  private router = inject(Router);

  submitForm: FormGroup;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  menuItemImages: (File | null)[] = [];
  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');
  isHeritageSite = signal(false);

  constructor() {
    this.submitForm = this.fb.group({
      name: ['', Validators.required],
      yearsInOperation: ['', Validators.required],
      category: ['Local Eatery', Validators.required],
      culturalStory: ['', [Validators.required, Validators.maxLength(500)]],
      address: ['', Validators.required],
      authenticityTraits: this.fb.array([]),
      menuHighlights: this.fb.array([]),
      // Heritage Site specific
      historicalSignificance: [''],
      yearEstablished: ['']
    });
  }

  ngOnInit() {
    // Listen to category changes to toggle conditional fields
    this.submitForm.get('category')?.valueChanges.subscribe(value => {
      this.isHeritageSite.set(value === 'Heritage Site');
      if (value === 'Heritage Site') {
        // Clear menu highlights when switching to Heritage Site
        while (this.menuHighlights.length) this.menuHighlights.removeAt(0);
        this.menuItemImages = [];
      } else {
        // Clear heritage fields when switching to Local Eatery
        this.submitForm.patchValue({ historicalSignificance: '', yearEstablished: '' });
      }
    });
  }

  get authenticityTraits() { return this.submitForm.get('authenticityTraits') as FormArray; }
  get menuHighlights() { return this.submitForm.get('menuHighlights') as FormArray; }

  addTrait() { this.authenticityTraits.push(this.fb.control('', Validators.required)); }
  removeTrait(index: number) { this.authenticityTraits.removeAt(index); }

  addMenuItem() {
    const itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });
    this.menuHighlights.push(itemForm);
    this.menuItemImages.push(null);
  }

  removeMenuItem(index: number) {
    this.menuHighlights.removeAt(index);
    this.menuItemImages.splice(index, 1);
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (this.selectedFiles.length < 4) {
          const file = files[i];
          this.selectedFiles.push(file);

          // FileReader for instant image preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  onMenuItemFileSelect(event: any, index: number) {
    const file = event.target.files[0];
    if (file) this.menuItemImages[index] = file;
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onSubmit() {
    if (this.submitForm.invalid || this.selectedFiles.length === 0) {
      this.errorMessage.set('Audit: Form invalid. Ensure all required fields and at least one primary image are present.');
      this.submitForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = new FormData();
    formData.append('name', this.submitForm.value.name);
    formData.append('category', this.submitForm.value.category);
    formData.append('address', this.submitForm.value.address);
    formData.append('yearsInOperation', this.submitForm.value.yearsInOperation);
    formData.append('culturalStory', this.submitForm.value.culturalStory);
    
    formData.append('authenticityTraits', JSON.stringify(this.submitForm.value.authenticityTraits));

    if (!this.isHeritageSite()) {
      // Local Eatery: send menu highlights
      formData.append('menuHighlights', JSON.stringify(this.submitForm.value.menuHighlights));
      this.menuItemImages.forEach(file => {
        if (file) formData.append('menuItemImages', file);
      });
    } else {
      // Heritage Site: send historical fields
      formData.append('historicalSignificance', this.submitForm.value.historicalSignificance || '');
      formData.append('yearEstablished', this.submitForm.value.yearEstablished || '');
    }

    this.selectedFiles.forEach(file => formData.append('images', file));

    this.submissionService.submitListing(formData).subscribe({
      next: (res) => {
        console.log('Audit: Submission Success', res);
        this.isLoading.set(false);
        this.isSuccess.set(true);
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Submission Failed: ${err.message}`);
      }
    });
  }
}
