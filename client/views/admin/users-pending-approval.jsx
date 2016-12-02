import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Loading } from '../components/loading.jsx';
import Swal from 'sweetalert';

export class UsersPendingApproval extends React.Component {
  toggleAdminAccess() {
    let userIds = [];
    let inputElements = document.getElementsByClassName('users');
    for (var i = 0; inputElements[i]; ++i) {
      if (inputElements[i].checked) {
        userIds.push(inputElements[i].value);
      }
    }
    if (userIds && !_.isEmpty(userIds)) {
      Meteor.call('toggleAdminAccess', userIds, function(error, result) {
        if (error) {
          console.log(error);
          swal({
            title: 'Ooops...',
            type: "error",
            text: error.reason
          })
        } else {
          for (var i = 0; inputElements[i]; ++i) {
            if (inputElements[i].checked) {
              inputElements[i].checked = false;
            }
          }
        }
      });
    }
  }
  getUserActions() {
    return <div className="btn-group">
      <button type="button" className="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i className="fa fa-cog"></i>
      </button>
      <ul className="dropdown-menu dropdown-menu-right" style={{cursor:"pointer"}}>
        <li><a onClick={this.toggleAdminAccess}>Toggle Admin access</a></li>
      </ul>
    </div>
  }
  getListOfusers() {
    let render = this.props.users.map(function(user, i) {
      let rowClass = "",
        userType = "Admin";
      if (!user.roles || !_.contains(user.roles, 'admin')) {
        rowClass = 'danger';
        userType = "Not-Admin";
      }
      return <tr key={i} className={rowClass} >
        <td>
          <input type="checkbox" className="users" value={user._id}/>
        </td>
        <td>{user.emails[0].address}</td>
        <td>{moment(user.createdAt).tz("America/Toronto").format('lll')}</td>
        <td>{userType}</td>
      </tr>
    });

    return render;
  }
  render() {
    return <div className="row">
      <div className="col-xs-12">
        <table className="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Users</th>
              <th>Created On</th>
              <th>{this.getUserActions()}</th>
            </tr>
          </thead>
          <tbody>
            {this.getListOfusers()}
          </tbody>
        </table>
      </div>
    </div>
  }
}


export default UsersPendingApproval = createContainer(props => {
  let sub = Meteor.subscribe('usersOnApp');
  let users = Meteor.users.find().fetch();
  return {
    loading: !sub.ready(),
    users: users
  }
}, UsersPendingApproval);