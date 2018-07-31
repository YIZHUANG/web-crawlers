import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class JobTable extends Component {
  render() {
    const columns = [
      {
        Header: 'title',
        accessor: 'jobTitle',
        minWidth: 250
      },
      {
        id: 'company',
        Header: 'company',
        accessor: d => d.company,
        minWidth: 200
      },
      {
        id: 'Link',
        Header: 'Link',
        accessor: 'link',
        Cell: props => (
          <a target="_blank" href={props.value} className="number">
            Redirect
          </a>
        )
      }
    ];

    return (
      <ReactTable
        loading={this.props.loading}
        data={this.props.jobs}
        columns={columns}
        width={1200}
      />
    );
  }
}
