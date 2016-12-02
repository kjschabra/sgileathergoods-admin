import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

export class PendingApproval extends React.Component {
  getUserEmail() {
    return Meteor.user().emails[0].address;
  }
  render() {
    return <div className="col-xs-12 text-center">
      <h3>Hello, <strong>{this.getUserEmail()}</strong></h3>
      <p>You are all set to go, just waiting for an admin approval. Please contact admin to allow you access.</p>
      <a href="/logout"><button className="btn btn-sm btn-primary">Log Out</button></a>
    </div>
  }
};