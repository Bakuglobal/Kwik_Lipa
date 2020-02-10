import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'selectshop', loadChildren: './selectshop/selectshop.module#SelectshopPageModule' },
  { path: 'image-display', loadChildren: './image-display/image-display.module#ImageDisplayPageModule' },
  // { path: 'create-list', loadChildren: './create-list/create-list.module#CreateListPageModule' },
  // { path: 'view-order', loadChildren: './view-order/view-order.module#ViewOrderPageModule' },
  // { path: 'view-list', loadChildren: './view-list/view-list.module#ViewListPageModule' },
  // { path: 'trans-modal', loadChildren: './modal/trans-modal/trans-modal.module#TransModalPageModule' },
  // { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  // { path: 'chatmodal', loadChildren: './chatmodal/chatmodal.module#ChatmodalPageModule' },
  // { path: 'e-receipt', loadChildren: './e-receipt/e-receipt.module#EReceiptPageModule' },
  // { path: 'loan', loadChildren: './loan/loan.module#LoanPageModule' },
  // { path: 'mycontacts', loadChildren: './mycontacts/mycontacts.module#MycontactsPageModule' },
  // { path: 'new-chat', loadChildren: './new-chat/new-chat.module#NewChatPageModule' },
  // { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  // { path: 'offers', loadChildren: './offers/offers.module#OffersPageModule' },
  // { path: 'payment', loadChildren: './payment/payment.module#PaymentPageModule' },
  // { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  
  // { path: 'wallet', loadChildren: './wallet/wallet.module#WalletPageModule' },
  // { path: 'transactions', loadChildren: './transactions/transactions.module#TransactionsPageModule' },
  //  { path: 'support', loadChildren: './support/support.module#SupportPageModule' },
  // { path: 'ipaytransmodal', loadChildren: './modal/ipaytransmodal/ipaytransmodal.module#IpaytransmodalPageModule' },
  // { path: 'comments', loadChildren: './comments/comments.module#CommentsPageModule' },
  // { path: 'postmodal', loadChildren: './postmodal/postmodal.module#PostmodalPageModule' },
  // { path: 'mycredits', loadChildren: './mycredits/mycredits.module#MycreditsPageModule' },
  // { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  // // { path: 'shop', loadChildren: './shop/shop.module#ShopPageModule' },
  // { path: 'sokomodal', loadChildren: './sokomodal/sokomodal.module#SokomodalPageModule' },
  // { path: 'infomodal', loadChildren: './infomodal/infomodal.module#InfomodalPageModule' },
  // { path: 'scanned-modal', loadChildren: './scanned-modal/scanned-modal.module#ScannedModalPageModule' },
  // { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },

  // { path: 'c', loadChildren: './c/c.module#CPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
