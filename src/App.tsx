import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Grid } from './component/grid';

type ColumnMapping = {
  [key: string]: {
    [columnKey: string]: {
      [valueKey: string]: string;
    } | string,
    selectedFunc: string,
  }
}

export const FUNCTION_MAPPING = {
  'getFileName': (props) => { return props.fileName },
  'default(x)': (props) => { return 'X' },
  'default(Null)': (props) => { return 'Null' },
  'default(NULL)': (props) => { return 'NULL' },
}

export const App = () => {
  const [data, setData] = useState<{[key: string]: { data: any, meta: any}}>({});
  const [columnsLabels, setColumnsLabels] = useState<string[]>([]);

  const [columnsMapping, setColumnsMapping] = useState<ColumnMapping>({});

  useEffect(() => {
    if (data) {
      Object.values(data).forEach(element => {
        setColumnsLabels((rows) => Array.from(new Set([...rows, ...element.meta.fields])));
      })
    }
  }, [data]);

  return <div className="App">
    <div className="App-header">
      <h2>Welcome to React</h2>
    </div>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
    input :
    <input
      type="file"
      onChange={(e) => {
        const fileArray = Array.from(e.target.files || [])

        fileArray.forEach((file) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              if (results.errors.length === 0) {
                setData((data) => ({...data, [file.name]: { data: results.data, meta: results.meta }}));
              }
            },
          })
        })
      }}
      multiple
    />
    <Grid data={data} columnLabels={columnsLabels} setContent={setColumnsMapping} />

    <button onClick={() => {

      const transformedData = Object.entries(data).flatMap( ([fileName, { data }]) => {
        return data.map((item) => {
          const transformedItem: { [key: string]: string } = {};
          for ( const [ key, value ] of Object.entries( columnsMapping ) ) {
            // console.log(key, value);

            const valueEntries = Object.entries(value)

            const [columnName, columnMap] = valueEntries[0];
            const [, funcMap] = valueEntries?.[1];

            const columnValue = item?.[Object.values(columnMap).find(name => item[name]) || ''];
            const selectedFunction = FUNCTION_MAPPING?.[funcMap as string];

            if ( columnValue === undefined && selectedFunction !== undefined ) {
              transformedItem[columnName] = selectedFunction( { fileName, item });
            } else {
              transformedItem[columnName] = columnValue;
            }
          }
          return transformedItem;
        })
      });

      const formData = new FormData();
      formData.append( 'data', Papa.unparse(transformedData));

      const request = new XMLHttpRequest();

      request.open( 'POST', 'http://localhost:8080/' );
      request.send( formData );
    }}>Process</button>
  </div>;
}