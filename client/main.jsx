import React from 'react';
import {Meteor} from 'meteor/meteor';
// define and export our Layout component
export const LoginLayout = ({content}) => (
  <div className="container-fluid">
    <h1 className="text-center">Admin Platform</h1>
    <hr/>
    <div className="row">
      <div className="col-md-12">{content}</div>
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
          <li><a href=""><i className="fa fa-sign-out"></i>Log-Out</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <div className="container">
    <div className="row" style={{marginTop: 50+"px"}}>
      <div className="col-md-2 sidebar">{sidebar}</div>
      <div className="col-md-10 main">{content}</div>
    </div>
  </div>
  </div>
);
