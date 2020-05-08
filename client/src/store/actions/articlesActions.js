import * as actionTypes from "./actionTypes";
import { ENDPOINT_URL } from "./config";
const options = data => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    method: "post",
    body: JSON.stringify(data)
  };
};

export const getAllArticles = () => {
  return dispatch => {
    fetch(ENDPOINT_URL + "api/transaction")
      .then(res => res.json())
      .then(res => {
        localStorage.setItem("AllArticles", JSON.stringify(res.articles));
        dispatch({
          type: actionTypes.GOT_ALL_ARTICLES,
          articles: res.articles
        });
      });
  };
};

export const getProducts = () => {
  return dispatch => {
    fetch(ENDPOINT_URL + "api/product")
      .then(res => res.json())
      .then(res => {
        dispatch({ type: actionTypes.GOT_ALL_PRODUCTS, products: res });
      });
  };
};

export const getReports = date => {
  return dispatch => {
    fetch(ENDPOINT_URL + "api/transaction/report?date=" + date)
      .then(res => res.json())
      .then(res => {
        dispatch({ type: actionTypes.GOT_REPORT, report: res.data });
      });
  };
};

export const getMyArticles = () => {
  return dispatch => {
    fetch(ENDPOINT_URL + "api/transaction/myarticles", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem("MyArticles", JSON.stringify(res.articles));
        dispatch({
          type: actionTypes.GOT_MY_ARTICLES,
          myArticles: res.articles
        });
      });
  };
};

export const getArticle = articleId => {
  return dispatch => {
    fetch(ENDPOINT_URL + "api/transaction/" + articleId)
      .then(res => res.json())
      .then(res => {
        console.log("RESPONSE", res);
        dispatch({
          type: actionTypes.GOT_SINGLE_ARTICLE,
          article: res.article
        });
      });
  };
};

export const submitNewArticle = articleData => {
  return dispatch => {
    return fetch(
      ENDPOINT_URL + "api/transaction/add",
      options(articleData)
    ).then(res => res.json());
  };
};

export const saveArticle = (articleId, articleData) => {
  return dispatch => {
    return fetch(
      ENDPOINT_URL + "api/transaction/edit/" + articleId,
      options(articleData)
    ).then(res => res.json());
  };
};

export const deleteArticle = articleId => {
  return dispatch => {
    return fetch(ENDPOINT_URL + "api/transaction/delete/" + articleId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        "Content-Type": "application/json"
      },
      method: "delete"
    }).then(res => res.json());
  };
};
