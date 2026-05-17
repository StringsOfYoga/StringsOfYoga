import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
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
  { path: '**', redirectTo: '' }
];
