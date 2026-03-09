import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ExploreMap } from './pages/explore-map/explore-map';
import { SubmitListing } from './pages/submit-listing/submit-listing';
import { Profile } from './pages/profile/profile';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'explore', component: ExploreMap },
  { path: 'submit', component: SubmitListing },
  { path: 'profile', component: Profile },
  { path: 'admin-login', component: AdminLogin },
  { path: 'admin-dashboard', component: AdminDashboard }
];
