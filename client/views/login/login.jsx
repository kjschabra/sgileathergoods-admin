import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Loading } from '../components/loading.jsx';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      form: 'Login'
    };
  }
  checkAndLogin(evt) {
    evt.preventDefault();
    let self = this;
    let userEmail = document.getElementById('email').value;
    let userPassword = document.getElementById('password').value;

    Meteor.loginWithPassword(userEmail, userPassword, function(error) {
      if (error) {
        self.setState({ error: error.reason });
      } else {
        FlowRouter.go('AdminHome');
      }
    });
  }
  checkAndRegister(evt) {
    evt.preventDefault();
    let self = this;
    let userEmail = document.getElementById('register-email').value;
    let userPassword = document.getElementById('register-password').value;
    if (userEmail && userPassword) {
      Accounts.createUser({email:userEmail, password: userPassword}, function(err, result) {
        if (err) {
          self.setState({error: err.reason});
        } else {
          FlowRouter.go('AdminHome');
        }
      });

    } else {
      self.setState({error: "Please provide an email and password"});
    }
  }
  getFormError() {
    if (this.state && this.state.error) {
      return <div className="error-notice">
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700} transitionAppear={true} transitionAppearTimeout={500}>
          <div className="oaerror danger">
            <strong>Error</strong> - {this.state.error}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    } else {
      return <div></div>
    }
  }
  toggleForm(value, evt) {
    this.setState({form: value, error: null});
  }
  getBtnClass(val) {
    if (val === this.state.form) {
      return 'btn-primary active';
    } else {
      return 'btn-default';
    }
  }
  getLoginOptions() {
    return <div className="col-xs-12 text-center" style={{marginBottom: 2+'em'}}>
      <div className="btn-group" role="group">
        <button type="button" onClick={this.toggleForm.bind(this, 'Login')} className={"btn btn-sm "+this.getBtnClass('Login')}>Login</button>
        <button type="button" onClick={this.toggleForm.bind(this, 'Register')} className={"btn btn-sm "+this.getBtnClass('Register')}>Register</button>
      </div>
    </div>
  }
  getRegisterForm() {
    let render = <div></div>;
    if (this.state.form === "Register") {
      render = <div className="col-sm-6 col-sm-offset-3 col-xs-12 jumbotron">
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700} transitionAppear={true} transitionAppearTimeout={500}>
          <h4 className='text-muted text-center'>Register</h4>
          {this.getFormError()}
          <form>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="register-email" ref="input-email" placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="register-password" ref="input-password" placeholder="Password" />
            </div>
            <button onClick={this.checkAndRegister.bind(this)} className="btn btn-primary text-right">Register</button>
          </form>
        </ReactCSSTransitionGroup>
      </div>
    }

    return render;
  }
  getLoginForm() {
    let render = <div></div>;
    if (this.state.form === "Login") {
      render = <div className="col-sm-6 col-sm-offset-3 col-xs-12 jumbotron">
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700} transitionAppear={true} transitionAppearTimeout={500}>
          <h4 className='text-muted text-center'>Login</h4>
          {this.getFormError()}
          <form>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" ref="input-email" placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" ref="input-password" placeholder="Password" />
            </div>
            <button onClick={this.checkAndLogin.bind(this)} className="btn btn-primary text-right">Log In</button>
          </form>
          <hr/>
          <a href="#" className="text-right text-muted">Forgot Password</a>
        </ReactCSSTransitionGroup>
      </div>
    }

    return render;
  }
  render() {
    if (Meteor.loggingIn()) {
      return <Loading />;
    } else {
      return <div>
        {this.getLoginOptions()}
        {this.getLoginForm()}
        {this.getRegisterForm()}
      </div>
    }
  }
};

export default Login = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  return {};
}, Login);