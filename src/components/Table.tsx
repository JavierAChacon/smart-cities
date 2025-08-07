import type { ReactNode } from "react"

type KeyValueRow = {
  key: string
  value: ReactNode
}

type TableProps =
  | {
      title: string
      type: "key-value"
      rows: KeyValueRow[]
    }
  | {
      title: string
      type: "full"
      headers: string[]
      rows: ReactNode[][]
    }

export default function Tabla(props: TableProps) {
  return (
    <div className='flex-1 border border-gray-700 rounded-lg overflow-hidden'>
      <h2 className='text-xl font-semibold px-4 py-2 bg-gray-800 border-b border-gray-700'>
        {props.title}
      </h2>

      <table className='min-w-full text-sm bg-gray-900'>
        {props.type === "key-value" ? (
          <tbody className='divide-y divide-gray-700'>
            {props.rows.map((row, idx) => (
              <tr key={idx}>
                <td className='px-4 py-2'>{row.key}</td>
                <td className='px-4 py-2'>{row.value}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <>
            <thead className='bg-gray-800 text-left'>
              <tr>
                {props.headers.map((h, idx) => (
                  <th key={idx} className='px-4 py-2'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-700'>
              {props.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className='px-4 py-2'>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
    </div>
  )
}
