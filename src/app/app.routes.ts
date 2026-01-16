import { Routes } from '@angular/router';
import { About } from './about/about';
import { Service } from './service/service';
import { Home } from './home/home';
import { Blog } from './blog/blog';
import { Class } from './class/class';
import { Contact } from './contact/contact';
import { Profile } from './profile/profile';
import { Price } from './price/price';
import { Single } from './single/single';
import { Team } from './team/team';
import { Landing } from './landing/landing';

export const routes: Routes = [
    { path: "", component: Landing },
    { path: "home", component: Home },
    { path: "blog", component: Blog },
    { path: "class", component: Class },
    { path: "contact", component: Contact },
    { path: "portfolio", component: Profile },
    { path: "price", component: Price },
    { path: "service", component: Service },
    { path: "single", component: Single },
    { path: "team", component: Team },
     { path: "landing", component: Landing },
    { path: "**", component: About }
];
