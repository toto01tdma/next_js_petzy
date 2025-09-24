'use client';

import React from 'react';


interface TableColumn {
    key: string;
    title: string;
    dataIndex: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, record: any) => React.ReactNode;
}

interface TableData {
    [key: string]: unknown;
}

interface DataTableProps {
    columns: TableColumn[];
    data: TableData[];
}

export default function DataTable({ columns, data }: DataTableProps) {
    return (
        <div className="overflow-x-auto px-0 py-3">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((record, index) => (
                        <tr key={String(record.key) || index}>
                            {columns.map((column) => (
                                <td
                                    key={`${record.key || index}-${column.key}`}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {column.render
                                        ? column.render(record[column.dataIndex], record)
                                        : (record[column.dataIndex] as React.ReactNode)
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
