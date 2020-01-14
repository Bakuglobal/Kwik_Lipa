import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthService } from '../Auth/auth.service';
import { LogsService } from '../Auth/logs.service';
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
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule),
            canActivate : [AuthService]
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
      { path: 'mycredits', loadChildren:()=> import( '../mycredits/mycredits.module').then(m => m.MycreditsPageModule) },
      { path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule) },
      { path: 'chatmodal', loadChildren: () => import('../chatmodal/chatmodal.module').then(m=>m.ChatmodalPageModule) },
      { path: 'e-receipt', loadChildren: () => import('../e-receipt/e-receipt.module').then(m=>m.EReceiptPageModule)},
      { path: 'loan', loadChildren: () => import('../loan/loan.module').then(m=>m.LoanPageModule) },
      { path: 'mycontacts', loadChildren: () => import('../mycontacts/mycontacts.module').then(m=>m.MycontactsPageModule),canActivate : [AuthService] },
      { path: 'new-chat', loadChildren: () => import('../new-chat/new-chat.module').then(m=>m.NewChatPageModule) },
      { path: 'notifications', loadChildren: () => import('../notifications/notifications.module').then(m=>m.NotificationsPageModule),canActivate : [AuthService] },
      { path: 'offers', loadChildren: () => import('../offers/offers.module').then(m=>m.OffersPageModule) },
      { path: 'payment', loadChildren: () => import('../payment/payment.module').then(m=>m.PaymentPageModule) },
      { path: 'login', loadChildren: () => import('../login/login.module').then(m=>m.LoginPageModule) },
      { path: 'register', loadChildren: () => import('../register/register.module').then(m=>m.RegisterPageModule) },
      { path: 'welcome', loadChildren: () => import('../welcome/welcome.module').then(m=>m.WelcomePageModule) },
      { path: 'transactions', loadChildren: () => import('../transactions/transactions.module').then(m=>m.TransactionsPageModule),canActivate : [AuthService]},
       { path: 'support', loadChildren: () => import('../support/support.module').then(m=>m.SupportPageModule),canActivate : [AuthService] },
      { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m=>m.SettingsPageModule),canActivate : [AuthService] },
      { path: 'welcome', loadChildren:() =>import( '../welcome/welcome.module').then(m => m.WelcomePageModule),canActivate: [LogsService]},
      {path : 'shop', loadChildren: () => import ('../shop/shop.module').then(m => m.ShopPageModule)},
      {path: 'cart', loadChildren: () => import ('../cart/cart.module').then(m=>m.CartPageModule),canActivate : [AuthService]},
      { path: 'c', loadChildren: () => import('../c/c.module').then(m => m.CPageModule), canActivate : [AuthService] },
      { path: 'forgot-password', loadChildren:() => import('../forgot-password/forgot-password.module').then(m  => m.ForgotPasswordPageModule)},
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
