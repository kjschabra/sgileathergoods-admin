import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Random } from 'meteor/random';
import Loading from '../components/loading.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export class RenderForm extends React.Component {
  checkAdditionalHTMLElements(formElements) {
    if (formElements && formElements.length > 0) {
      let self = this;
      return formElements.map(function(element, i) {
        if (element.tagDivClass) {
          return <div key={i} className={element.tagDivClass}>
            <small id={element.ref} className="text-danger"></small>
            {self.renderFormElements(element)}
          </div>
        } else {
          return self.renderFormElements(element);
        }
      });
    }
  }
  checkTag(elem) {
    elem.preventDefault();
    return elem.target.value.trim();
  }
  renderPossibleElementErrors(errors) {
    if (errors && errors.length > 0) {
      return errors.join(",");
    } else {
      return "";
    }
  }
  renderFormElements(element) {
    if (element.tag && element.tag === "label") {
      return <label htmlFor={element.ref} className={element.tagClass}>{element.labelValue}</label>
    }
    if (element.tag && element.tag === "input") {
      return <input className={element.tagClass} data-errors={this.renderPossibleElementErrors(element.errors)} name={element.ref}  ref={element.ref} onChange={this.props.onUpdate.bind(element.ref)} type={element.tagType} placeholder={element.placeholder} defaultValue={element.value} multiple={element.multiple}/>
    }
    if (element && element.tag === "select") {
      let value = "";
      element.value.map(function(val, i) {
        let selected = undefined;
        if (val && val.selected) {
          value = val.value;
        }
      });

      return <select name={element.ref} defaultValue={value} className={element.tagClass} ref={element.ref} onChange={this.props.onUpdate.bind(element.ref)} data-errors={this.renderPossibleElementErrors(element.errors)}>
        {element.value.map(function(val, i){
          return <option key={i} value={val.value}>{val.label}</option>
        })}
      </select>
    }
    if (element.tag && element.tag === "textarea") {
      return <textarea className={element.tagClass} data-errors={this.renderPossibleElementErrors(element.errors)} name={element.ref}  ref={element.ref} onChange={this.props.onUpdate.bind(element.ref)} placeholder={element.placeholder} defaultValue={element.value} rows={element.rows || "5"}/>
    }
    if (element && element.tag === "img") {
      return <img className={element.tagClass || ""} name={element.ref} alt={element.alt || ""} src={element.src || "" } />
    }
  }
  renderForm() {
    if (this.props.formData) {
      return this.props.formData.map((form, i) => (
        <div key={i} className="form-group">
          <div className="row text-center">
            <span className="text-danger" id={form.ref}></span>
          </div>
          <label className={form.labelClass}>{form.labelValue}</label>
          <div className={form.tagDivClass}>
            {this.renderFormElements(form)}
          </div>
          {this.checkAdditionalHTMLElements(form.additionalTag)}
        </div>
      ));
    }
  }
  render() {
    return <form className={this.props.formClass}>{this.renderForm()}</form>
  }
}
export default RenderForm = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  return {};
}, RenderForm);