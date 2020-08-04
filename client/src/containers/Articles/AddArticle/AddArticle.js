import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import {
  submitNewArticle,
  getProducts
} from "../../../store/actions/articlesActions";
import ErrorMsg from "../../../components/ErrorMsg/ErrorMsg";
import InputField from "../../../components/InputField/InputField";

class AddArticle extends Component {
  state = {
    article: {},
    errors: {}
  };

  componentWillMount() {
    this.props.getAllProducts();
    if (localStorage.getItem("AddArticlePage") !== null) {
      const { article, errors } = JSON.parse(
        localStorage.getItem("AddArticlePage")
      );
      this.setState(prevState => {
        return {
          ...prevState,
          article: { ...article, title: "sample1" },
          errors: { ...errors }
        };
      });
    }
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
            ...prevState.article,
            [field]: value
          },
          errors: { ...errors }
        };
      },
      () => localStorage.setItem("AddArticlePage", JSON.stringify(this.state))
    );
  };

  componentWillUnmount() {
    localStorage.removeItem("AddArticlePage");
  }

  handleNewArticleSubmit = e => {
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
        .submitNewArticle({
          ...this.state.article,
          author: this.props.authenticatedUsername
        })
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
            this.props.history.push("/");
          }
        });
    }
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="container">
        <br />
        <h3 className="text-center">Add Article</h3>
        <div className="jumbotron">
          <form onSubmit={this.handleNewArticleSubmit}>
            <InputField
              key="author"
              type="text"
              name="author"
              label="Author"
              defaultValue={this.props.authenticatedUsername}
              disabled="disabled"
              errors={this.state.errors}
              onChange={this.handleInputChange}
            />
            <div className="form-group">
              <label>Product</label>
              <select
                name="title"
                onChange={this.handleInputChange}
                defaultValue={this.state.article.title}
                className="form-control"
                id="Select Product"
              >
                {this.props.products &&
                  this.props.products.map(product => {
                    return (
                      <option key={product.name} value={product.name}>
                        {product.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                className="form-control"
                placeholder="Enter Amount"
                onChange={this.handleInputChange}
                defaultValue={this.state.article.amount}
              />
              {this.state.errors.amount !== "" && (
                <ErrorMsg msg={this.state.errors.amount} />
              )}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                style={{ height: "200px" }}
                className="form-control"
                placeholder="Description"
                onChange={this.handleInputChange}
                defaultValue={this.state.article.body}
              />
              {this.state.errors.description !== "" && (
                <ErrorMsg msg={this.state.errors.description} />
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
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state, "state");
  return {
    isAuthenticated: state.users.isAuthenticated,
    authenticatedUsername: state.users.authenticatedUsername,
    products: state.articles.products
  };
};

const mapDispatchToProps = dispatch => {
  return {
    submitNewArticle: articleData => dispatch(submitNewArticle(articleData)),
    getAllProducts: () => dispatch(getProducts())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArticle);
