import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';
// load Layout and Welcome React components
import {AdminLayout, LoginLayout} from './main.jsx';
import AccountsUI from './views/accounts.jsx';
import ProductsDisplay from './views/admin/products-display.jsx';
import AddProductDisplay from './views/admin/add-product-display.jsx';
import EditProductDisplay from './views/admin/edit-product-display.jsx';
import Sidebar from './views/admin/sidebar.jsx';
FlowRouter.route("/", {
  name: 'Home',
  triggersEnter: [function(context, redirect) {
      if (!Meteor.userId()) {
        FlowRouter.go('/login');
      } else {
        FlowRouter.go('/admin');
      }
    }
  ]
});
FlowRouter.route("/login", {
  name: 'Login',
  triggersEnter: [function(context, redirect) {
    if (Meteor.userId())
      FlowRouter.go('/admin');
  }],
  action() {
    mount(LoginLayout, {content: <AccountsUI/>});
  }
});
let adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function(context, redirect) {
      if (!Meteor.userId()) {
        FlowRouter.go('/');
      }
    }
  ]
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
