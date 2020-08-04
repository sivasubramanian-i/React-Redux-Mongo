import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getReports } from "../../store/actions/articlesActions";

class Report extends Component {
  state = {
    date: new Date()
  };
  Search = () => {
    this.props.getReport(this.state.date);
    console.log(this.state.date, "Date");
  };
  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="container">
        <br></br>
        <div className="Header">
          <div className=" row col-md-12">
            <div className="col-md-6">
              <h3 style={{ display: "inline-block" }}>Report</h3>
            </div>
            <div className="col-md-6 row">
              <div className="col-md-6">
                <input
                  type="date"
                  value={this.state.date}
                  onChange={event =>
                    this.setState({ date: event.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <button
                  className="btn btn-info mr-2 mb-2"
                  sstyle={{ float: "right", padding: "2px 12px" }}
                  onClick={this.Search}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <section className="jumbotron">
          <div className="col-md-12 text-center">
            {this.props.report &&
              this.props.report.map(data => (
                <div className="p-4 m-4 list-box" key={data._id.title}>
                  <span>
                    {" "}
                    Author : <strong>{data._id.title}</strong> ,{" "}
                  </span>{" "}
                  <span>
                    {" "}
                    Total:
                    <strong>
                      {data.totalAmount ? data.totalAmount : 0}{" "}
                    </strong>,{" "}
                  </span>{" "}
                  Count : <strong>{data.count}</strong>
                </div>
              ))}
            {this.props.report.length === 0 && <span>No Records Found</span>}
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state, "STATEREPORTS");
  return {
    report: state.articles.report || [],
    isAuthenticated: state.users.isAuthenticated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getReport: date => dispatch(getReports(date))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
