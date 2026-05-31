import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('StringsOfYoga');
  protected showFooter = signal(true);
  protected showHeader = signal(true);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const isAdmin = event.urlAfterRedirects.startsWith('/admin');
      this.showFooter.set(!isAdmin);
      this.showHeader.set(!isAdmin);
    });
  }

  ngOnInit(): void {
  }
}
