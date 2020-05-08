import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { saveArticle } from "../../../store/actions/articlesActions";
import ErrorMsg from "../../../components/ErrorMsg/ErrorMsg";
import InputField from "../../../components/InputField/InputField";

let fieldsArray = [
  { name: "title", type: "text", label: "Title" },
  { name: "author", type: "text", label: "Author", disabled: "disabled" },
  { name: "amount", type: "number", label: "Amount" }
];

class EditArticle extends Component {
  state = {
    article: {},
    errors: {}
  };

  componentWillMount() {
    const articleId = this.props.match.params.id;
    let article, errors;
    if (localStorage.getItem("Edit" + articleId) === null) {
      localStorage.setItem(
        "Edit" + articleId,
        JSON.stringify({ article: this.props.article, errors: {} })
      );
      article = this.props.article;
      errors = {};
    } else {
      article = JSON.parse(localStorage.getItem("Edit" + articleId)).article;
      errors = JSON.parse(localStorage.getItem("Edit" + articleId)).errors;
    }
    console.log(this.props, "propes___Data");
    this.setState(prevState => {
      return {
        ...prevState,
        article: { ...article },
        errors: { ...errors }
      };
    });
  }

  handleValidation = (field, value) => {
    let error = {};
    if (value === "") {
      error[field] = "This field is required";
    } else {
      error[field] = "";
    }
    return error;
  };

  handleInputChange = e => {
    const field = e.target.name;
    const value = e.target.value;

    const errors = {
      ...this.state.errors,
      ...this.handleValidation(field, value)
    };
    this.setState(
      prevState => {
        return {
          ...prevState,
          article: {
            ...this.props.article,
            [field]: value
          },
          errors: { ...errors }
        };
      },
      () =>
        localStorage.setItem(
          "Edit" + this.state.article._id,
          JSON.stringify(this.state)
        )
    );
  };

  handleEditArticleSubmit = e => {
    e.preventDefault();
    let errors = { ...this.state.errors };
    const formValuesValid =
      Object.keys(errors).filter(field => errors[field] !== "").length === 0
        ? true
        : false;
    if (!formValuesValid) {
      return;
    } else {
      this.props
        .saveArticle(this.props.match.params.id, this.state.article)
        .then(res => {
          if (res.errors) {
            this.setState(prevState => {
              return {
                ...prevState,
                article: { ...prevState.article },
                errors: { ...prevState.errors, ...res.errors }
              };
            });
          } else {
            localStorage.removeItem("Edit" + this.props.match.params.id);
            this.props.history.push("/");
          }
        });
    }
  };

  componentWillUnmount() {
    localStorage.removeItem("Edit" + this.props.match.params.id);
  }

  render() {
    const inputFields = fieldsArray.map(field => (
      <InputField
        key={field.name}
        type={field.type}
        name={field.name}
        label={field.label}
        defaultValue={this.props.article[field.name]}
        disabled={field.disabled}
        errors={this.state.errors}
        onChange={this.handleInputChange}
      />
    ));

    return (
      <div className="container">
        <br />
        <h3 className="text-center">Edit Article</h3>
        <div className="jumbotron">
          <form onSubmit={this.handleEditArticleSubmit}>
            {inputFields}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="body"
                style={{ height: "200px" }}
                className="form-control"
                onChange={this.handleInputChange}
                defaultValue={this.props.article.body}
              />
              {this.state.errors.body !== "" && (
                <ErrorMsg msg={this.state.errors.body} />
              )}
            </div>

            <NavLink
              to="/"
              className="btn btn-primary float-right"
              style={{ margin: "5px" }}
            >
              Cancel
            </NavLink>
            <button
              className="btn btn-success float-right"
              style={{ margin: "5px" }}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state, "STATA");
  return {
    article: state.articles.article
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveArticle: (articleId, articleData) =>
      dispatch(saveArticle(articleId, articleData))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditArticle)
);
