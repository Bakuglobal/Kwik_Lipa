import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'recommend', loadChildren: './recommend/recommend.module#RecommendPageModule' },
  { path: 'shopprofile', loadChildren: './shopprofile/shopprofile.module#ShopprofilePageModule' },
  { path: 'home', loadChildren: './Donations/home/home.module#HomePageModule' },
  { path: 'regions', loadChildren: './Donations/regions/regions.module#RegionsPageModule' },
  { path: 'packages', loadChildren: './Donations/packages/packages.module#PackagesPageModule' },
  { path: 'shop', loadChildren: './Donations/shop/shop.module#ShopPageModule' },
  { path: 'cart', loadChildren: './Donations/cart/cart.module#CartPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
