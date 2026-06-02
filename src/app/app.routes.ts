import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AdminLogin } from './features/admin/login/admin-login';
import { AdminDashboard } from './features/admin/dashboard/admin-dashboard';
import { AdminWorkshops } from './features/admin/workshops/admin-workshops';
import { AdminResources } from './features/admin/resources/admin-resources';
import { AdminPlaceholder } from './features/admin/placeholder/admin-placeholder';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'admin/login', component: AdminLogin, title: 'Admin Login' },
  {
    path: 'admin',
    component: AdminDashboard,
    title: 'Admin Dashboard',
    children: [
      { path: '', redirectTo: 'workshops', pathMatch: 'full' },
      { path: 'workshops', component: AdminWorkshops, title: 'Manage Workshops' },
      { path: 'resources', component: AdminResources, title: 'Manage Resources' },
      { path: 'courses', component: AdminPlaceholder, title: 'Manage Courses', data: { sectionName: 'Courses' } },
      { path: 'blog', component: AdminPlaceholder, title: 'Manage Blog', data: { sectionName: 'Blog' } },
      { path: 'featured', component: AdminPlaceholder, title: 'Manage Featured', data: { sectionName: 'Featured' } },
      { path: 'settings', component: AdminPlaceholder, title: 'Settings', data: { sectionName: 'Settings' } }
    ]
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(m => m.About),
    title: 'About'
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/courses').then(m => m.Courses),
    title: 'Courses'
  },
  {
    path: 'workshops',
    loadComponent: () => import('./features/workshops/workshops').then(m => m.Workshops),
    title: 'Workshops'
  },
  {
    path: 'workshops/:id',
    loadComponent: () =>
      import('./features/workshops/workshop-detail/workshop-detail').then(m => m.WorkshopDetail),
    title: 'Workshop'
  },
  {
    path: 'resources',
    loadComponent: () => import('./features/resources/resources').then(m => m.Resources),
    title: 'Resources'
  },
  {
    path: 'testimonials',
    loadComponent: () => import('./features/testimonials/testimonials').then(m => m.Testimonials),
    title: 'Testimonials'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact),
    title: 'Contact'
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog').then(m => m.Blog),
    title: 'Blog'
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./features/blog/blog-post/blog-post').then(m => m.BlogPostPage)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy').then(m => m.Privacy),
    title: 'Privacy Policy'
  },
  { path: '**', redirectTo: '' }
];
