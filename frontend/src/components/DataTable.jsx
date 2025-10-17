import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessorKey}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-8 text-center text-gray-500"
              >
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row._id || idx} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.accessorKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.cell ? column.cell({ row: { original: row } }) : row[column.accessorKey]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(row)}
                    className="text-primary-600 hover:text-primary-900 mr-4 transition-colors"
                  >
                    <Edit className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
