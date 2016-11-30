import React from 'react';
import {Meteor} from 'meteor/meteor';
// define and export our Layout component
export const LoginLayout = ({content}) => (
  <div className="container-fluid">
    <div className="row" style={{marginTop: 2+'em'}}>
      <div className="col-md-12">
        <p className="lead text-center">SGI Leather Goods Admin</p>
      </div>
      <div className="col-md-12">
        {content}
      </div>
    </div>
  </div>
);
export const AdminLayout = ({sidebar, content}) => (
  <div>
  <nav className="navbar navbar-inverse navbar-fixed-top">
    <div className="container-fluid">
      <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand" href="/admin">SGI Leather Goods</a>
      </div>
      <div id="navbar" className="navbar-collapse collapse">
        <ul className="nav navbar-nav navbar-right">
          <li><a href='/logout'><i className="fa fa-sign-out"></i>Log-Out</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <div className="container-fluid">
    <div className="row">
      <div className="col-sm-3 col-md-2 sidebar" style={{marginTop:50+'px'}}>{sidebar}</div>
      <div className="col-sm-9 col-md-10 main" style={{marginTop:50+'px'}}>{content}</div>
    </div>
  </div>
  </div>
);
