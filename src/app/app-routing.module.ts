import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'home', loadChildren: './Recipes/home/home.module#HomePageModule' },
  { path: 'profile', loadChildren: './Restaurants/profile/profile.module#ProfilePageModule' },
  { path: 'profile', loadChildren: './Recipes/profile/profile.module#ProfilePageModule' },
  { path: 'details-modal', loadChildren: './Restaurants/details-modal/details-modal.module#DetailsModalPageModule' },
  { path: 'details-modal', loadChildren: './Recipes/details-modal/details-modal.module#DetailsModalPageModule' },
  { path: 'lifestyle', loadChildren: './lifestyle/lifestyle.module#LifestylePageModule' },
  { path: 'new-sign-up', loadChildren: './new-sign-up/new-sign-up.module#NewSignUpPageModule' },
  { path: 'new-sign-in', loadChildren: './new-sign-in/new-sign-in.module#NewSignInPageModule' },
  { path: 'new-sign-in-code', loadChildren: './new-sign-in-code/new-sign-in-code.module#NewSignInCodePageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
