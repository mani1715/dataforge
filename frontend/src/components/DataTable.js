import React from 'react';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) return <div className="card"><p>No data to display</p></div>;

  const headers = Object.keys(data[0]);

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {headers.map(key => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map(key => (
                <td key={key}>
                  {(row[key] === null || row[key] === "NaN") 
                    ? <span className="missing-val">MISSING</span> 
                    : String(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;