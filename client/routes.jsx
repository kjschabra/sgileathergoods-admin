import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
// load Layout and Welcome React components
import { AdminLayout, LoginLayout } from './main.jsx';
import { Login } from './views/login/login.jsx';
import { PendingApproval } from './views/login/pendingVerification.jsx';
import { AccountsUI } from './views/accounts.jsx';
import { ProductsDisplay } from './views/admin/products-display.jsx';
import { AddProductDisplay } from './views/admin/add-product-display.jsx';
import { EditProductDisplay } from './views/admin/edit-product-display.jsx';
import { HiddenProductsDisplay } from './views/admin/hidden-products-display.jsx';
import { DeletedProductsDisplay } from './views/admin/deleted-products-display.jsx';
import { UsersPendingApproval } from './views/admin/users-pending-approval.jsx';
import Sidebar from './views/admin/sidebar.jsx';
FlowRouter.route("/", {
  name: 'Home',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.userId()) {
      redirect('Login');
    } else {
      redirect('AdminHome');
    }
  }]
});
FlowRouter.route("/login", {
  name: 'Login',
  triggersEnter: [function(context, redirect) {
    if (Meteor.userId())
      FlowRouter.go('/admin');
  }],
  action() {
    mount(LoginLayout, { content: <Login /> });
  }
});

FlowRouter.route('/logout', {
  name: 'Logout',
  triggersEnter: [function(context, redirect) {
    if (Meteor.userId()) {
      Meteor.logout();
    } else {
      redirect('Login');
    }
  }],
  action() {
    mount(LoginLayout, { content: <Login /> });
  }
});

FlowRouter.route('/pending-approval', {
  name: 'PendingApproval',
  triggersEnter: [function(context, redirect) {
    var user = Meteor.user();
    if (!user) {
      redirect('Login');
    }
  }],
  action() {
    mount(LoginLayout, {content: <PendingApproval /> } )
  }
});

let adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function(context, redirect) {
    Meteor.subscribe("userData");
    var user = Meteor.user();
    if (!user)
      redirect('Login');
    if (user && !user.roles)
      redirect('PendingApproval');
    if (user && user.roles && !_.contains(user.roles, 'admin') )
      redirect('PendingApproval');
  }]
});
adminRoutes.route("/", {
  name: 'AdminHome',
  action() {
    mount(AdminLayout, {
      sidebar: <Sidebar/>,
      content: <ProductsDisplay/>
    });
  }
});
adminRoutes.route('/add-product', {
  name: 'AdminAddProduct',
  action() {
    mount(AdminLayout, {
      sidebar: <Sidebar/>,
      content: <AddProductDisplay/>
    });
  }
});
adminRoutes.route('/edit-product/:productId', {
  name: 'AdminEditProduct',
  action(params) {
    mount(AdminLayout, {
      sidebar: <Sidebar/>,
      content: <EditProductDisplay productId={params.productId}/>
    });
  }
});
adminRoutes.route('/hidden-products', {
  name: "AdminHiddenProducts",
  action(params) {
    mount(AdminLayout, {
      sidebar: <Sidebar/>,
      content: <HiddenProductsDisplay />
    });
  }
});
adminRoutes.route('/deleted-products', {
  name: "AdminDeletedProducts",
  action(params) {
    mount(AdminLayout, {
      sidebar: <Sidebar/>,
      content: <DeletedProductsDisplay />
    });
  }
});
adminRoutes.route('/pending-approval', {
  name: "AdminPendingApproval",
  action(params) {
    mount(AdminLayout, {
      sidebar: <Sidebar />,
      content: <UsersPendingApproval />
    });
  }
});
