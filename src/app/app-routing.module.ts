import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '',
  //     loadChildren: './login/login.module#LoginPageModule' },
  // //   {
  //     path: 'tabs',
  //     loadChildren: './tabs/tabs.module#TabsPageModule'
  //   },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'trans-modal', loadChildren: './modal/trans-modal/trans-modal.module#TransModalPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'chatmodal', loadChildren: './chatmodal/chatmodal.module#ChatmodalPageModule' },
  { path: 'e-receipt', loadChildren: './e-receipt/e-receipt.module#EReceiptPageModule' },
  { path: 'loan', loadChildren: './loan/loan.module#LoanPageModule' },
  { path: 'mycontacts', loadChildren: './mycontacts/mycontacts.module#MycontactsPageModule' },
  { path: 'new-chat', loadChildren: './new-chat/new-chat.module#NewChatPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  { path: 'offers', loadChildren: './offers/offers.module#OffersPageModule' },
  { path: 'payment', loadChildren: './payment/payment.module#PaymentPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  
  { path: 'wallet', loadChildren: './wallet/wallet.module#WalletPageModule' },
  { path: 'transactions', loadChildren: './transactions/transactions.module#TransactionsPageModule' },
   { path: 'support', loadChildren: './support/support.module#SupportPageModule' },
  { path: 'ipaytransmodal', loadChildren: './modal/ipaytransmodal/ipaytransmodal.module#IpaytransmodalPageModule' },
  { path: 'comments', loadChildren: './comments/comments.module#CommentsPageModule' },
  { path: 'postmodal', loadChildren: './postmodal/postmodal.module#PostmodalPageModule' },
  { path: 'mycredits', loadChildren: './mycredits/mycredits.module#MycreditsPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  // { path: 'shop', loadChildren: './shop/shop.module#ShopPageModule' },
  { path: 'sokomodal', loadChildren: './sokomodal/sokomodal.module#SokomodalPageModule' },
  { path: 'infomodal', loadChildren: './infomodal/infomodal.module#InfomodalPageModule' },  { path: 'scanned-modal', loadChildren: './scanned-modal/scanned-modal.module#ScannedModalPageModule' }

<<<<<<< HEAD
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
=======
const routes: Routes = [
  // { path: '',
  //     loadChildren: './login/login.module#LoginPageModule' },
  // //   {
  //     path: 'tabs',
  //     loadChildren: './tabs/tabs.module#TabsPageModule'
  //   },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'trans-modal', loadChildren: './modal/trans-modal/trans-modal.module#TransModalPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'chatmodal', loadChildren: './chatmodal/chatmodal.module#ChatmodalPageModule' },
  { path: 'e-receipt', loadChildren: './e-receipt/e-receipt.module#EReceiptPageModule' },
  { path: 'loan', loadChildren: './loan/loan.module#LoanPageModule' },
  { path: 'mycontacts', loadChildren: './mycontacts/mycontacts.module#MycontactsPageModule' },
  { path: 'new-chat', loadChildren: './new-chat/new-chat.module#NewChatPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  { path: 'offers', loadChildren: './offers/offers.module#OffersPageModule' },
  { path: 'payment', loadChildren: './payment/payment.module#PaymentPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  
  { path: 'wallet', loadChildren: './wallet/wallet.module#WalletPageModule' },
  { path: 'transactions', loadChildren: './transactions/transactions.module#TransactionsPageModule' },
   { path: 'support', loadChildren: './support/support.module#SupportPageModule' },
  { path: 'ipaytransmodal', loadChildren: './modal/ipaytransmodal/ipaytransmodal.module#IpaytransmodalPageModule' },
  { path: 'comments', loadChildren: './comments/comments.module#CommentsPageModule' },
  { path: 'postmodal', loadChildren: './postmodal/postmodal.module#PostmodalPageModule' },
  { path: 'mycredits', loadChildren: './mycredits/mycredits.module#MycreditsPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  // { path: 'shop', loadChildren: './shop/shop.module#ShopPageModule' },
  { path: 'sokomodal', loadChildren: './sokomodal/sokomodal.module#SokomodalPageModule' },
  { path: 'infomodal', loadChildren: './infomodal/infomodal.module#InfomodalPageModule' },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
>>>>>>> 266ee34a414ed15bf4dc5de5b31a56af5aa4d8ab
