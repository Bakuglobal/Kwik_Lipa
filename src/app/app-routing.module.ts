import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'delivery-address', loadChildren: './checkout/delivery-address/delivery-address.module#DeliveryAddressPageModule' },  { path: 'chat-app', loadChildren: './chat-app/chat-app.module#ChatAppPageModule' },
  { path: 'users', loadChildren: './users/users.module#UsersPageModule' },
  { path: 'chats', loadChildren: './chats/chats.module#ChatsPageModule' }

  // { path: 'home', loadChildren: './Recipes/home/home.module#HomePageModule' },
  // { path: 'profile', loadChildren: './Restaurants/profile/profile.module#ProfilePageModule' },
  // { path: 'profile', loadChildren: './Recipes/profile/profile.module#ProfilePageModule' },
  // { path: 'details-modal', loadChildren: './Restaurants/details-modal/details-modal.module#DetailsModalPageModule' },
  // { path: 'details-modal', loadChildren: './Recipes/details-modal/details-modal.module#DetailsModalPageModule' },
  // { path: 'lifestyle', loadChildren: './lifestyle/lifestyle.module#LifestylePageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
