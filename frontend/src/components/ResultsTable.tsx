import React from 'react';

interface ResultsTableProps {
  results: Array<{ result: any; value: any }>;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return <div className="w-full flex p-4 border rounded-md items-center justify-center">No results to display</div>;
  }

  return (
    <div className="w-full p-4 border rounded-md">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&amp;_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[100px]">
                Metric
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="[&amp;_tr:last-child]:border-0">
            {results.map((result, index) => (
              <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle font-medium">{result.result}</td>
                <td className="p-4 align-middle">{isNaN(result.value) || result.value === null || result.value === undefined ? "Invalid Value" : result.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
