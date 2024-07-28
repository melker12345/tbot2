import React from 'react';

interface ResultsTableProps {
  results: Array<{ result: string; value: string }>;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
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
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">{result.result}</td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">{result.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
