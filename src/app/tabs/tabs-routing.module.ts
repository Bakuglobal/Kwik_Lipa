import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthService } from '../Auth/auth.service';
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
       
      {
        path: 'chat-home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../chat-module/chat-home/chat-home.module').then(m => m.ChatHomePageModule), canActivate: [AuthService]
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      },
      { path: 'wallet', 
            children: [
              {
                path: '',
                loadChildren: () => import('../wallet/wallet.module').then(m=>m.WalletPageModule),
                canActivate : [AuthService] 
              }
            ]
      },
      {path: 'selectshop', loadChildren:() => import('../selectshop/selectshop.module').then(m => m.SelectshopPageModule)},
      {
        path: 'viewlist', loadChildren:() => import('../view-list/view-list.module').then(m => m.ViewListPageModule), canActivate: [AuthService]
      },
      {
        path: 'createList', loadChildren:() => import('../create-list/create-list.module').then(m => m.CreateListPageModule), canActivate: [AuthService]
      },
      {
        path: 'delivery', loadChildren:() => import( '../checkout/delivery-address/delivery-address.module').then(m => m.DeliveryAddressPageModule)
      },
      { path: 'mycredits', loadChildren:()=> import( '../mycredits/mycredits.module').then(m => m.MycreditsPageModule) },
      { path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule) },
      { path: 'e-receipt', loadChildren: () => import('../e-receipt/e-receipt.module').then(m=>m.EReceiptPageModule)},
      { path: 'shoppinglist', loadChildren: () => import('../shoppinglist/shoppinglist.module').then(m=>m.MycontactsPageModule),canActivate : [AuthService] },
      { path: 'notifications', loadChildren: () => import('../notifications/notifications.module').then(m=>m.NotificationsPageModule),canActivate : [AuthService] },
      { path: 'offers', loadChildren: () => import('../offers/offers.module').then(m=>m.OffersPageModule) },
      { path: 'payment', loadChildren: () => import('../payment/payment.module').then(m=>m.PaymentPageModule) },
      { path: 'login', loadChildren: () => import('../login/login.module').then(m=>m.LoginPageModule) },
      { path: 'register', loadChildren: () => import('../register/register.module').then(m=>m.RegisterPageModule) },
      { path: 'welcome', loadChildren: () => import('../welcome/welcome.module').then(m=>m.WelcomePageModule) },
      { path: 'transactions', loadChildren: () => import('../transactions/transactions.module').then(m=>m.TransactionsPageModule),canActivate : [AuthService]},
       { path: 'support', loadChildren: () => import('../support/support.module').then(m=>m.SupportPageModule),canActivate : [AuthService] },
      { path: 'profile', loadChildren: () => import('../Profile/profile.module').then(m=>m.SettingsPageModule), canActivate : [AuthService] },
      { path: 'welcome', loadChildren:() =>import( '../welcome/welcome.module').then(m => m.WelcomePageModule)},
      {path : 'shop', loadChildren: () => import ('../shop/shop.module').then(m => m.ShopPageModule)},
      {path: 'cart', loadChildren: () => import ('../cart/cart.module').then(m=>m.CartPageModule),canActivate : [AuthService]},
      { path: 'c', loadChildren: () => import('../c/c.module').then(m => m.CPageModule), canActivate : [AuthService] },
      { path: 'shopprofile', loadChildren: () => import('../shopprofile/shopprofile.module').then(m => m.ShopprofilePageModule)},
      { path: 'home', loadChildren: () => import('../Donations/home/home.module').then(m => m.HomePageModule)},
      { path: 'region', loadChildren: () => import('../Donations/regions/regions.module').then(m => m.RegionsPageModule)},
      { path: 'packages', loadChildren:() => import('../Donations/packages/packages.module').then(m  => m.PackagesPageModule)},
      { path: 'Regionshop', loadChildren: () => import('../Donations/shop/shop.module').then(m => m.ShopPageModule)},
      { path: 'restaurants', loadChildren: () => import('../Restaurants/home/home.module').then(m => m.HomePageModule)},
      { path: 'Donationcart', loadChildren: () => import('../Donations/cart/cart.module').then(m => m.CartPageModule)},
      { path: 'recipes', loadChildren: () => import('../Recipes/home/home.module').then(m => m.HomePageModule)},
      { path: 'profile', loadChildren: () => import('../Restaurants/profile/profile.module').then(m => m.ProfilePageModule)},
      { path: 'details', loadChildren: () => import('../Restaurants/details-modal/details-modal.module').then(m => m.DetailsModalPageModule)},
      { path: 'Recipeprofile', loadChildren: () => import('../Recipes/profile/profile.module').then(m => m.ProfilePageModule)},
      { path: 'recipeDetails', loadChildren: () => import('../Recipes/details-modal/details-modal.module').then(m => m.DetailsModalPageModule)},
      { path: 'recommend' , loadChildren:() => import('../recommend/recommend.module').then(m => m.RecommendPageModule), canActivate: [AuthService]},
      { path: 'lifestyle' , loadChildren:() => import('../lifestyle/lifestyle.module').then(m => m.LifestylePageModule)},
      { path: 'verifycode', loadChildren:() => import('../verify-code/verify-code.module').then(m => m.VerifyCodePageModule)}, 
      { path: 'ipaytransmodal', loadChildren:() => import('../modal/ipaytransmodal/ipaytransmodal.module').then(m => m.IpaytransmodalPageModule), canActivate: [AuthService]},
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
