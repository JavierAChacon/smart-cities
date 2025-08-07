type Props = {
  label: string
  valor: string
  border: string
}

export default function Indicator({ label, valor, border }: Props) {
  return (
    <div className='bg-gray-900 rounded-lg p-4 border border-gray-700 text-center'>
      <h2 className='text-sm mb-2'>{label}</h2>
      <div
        className={`w-32 h-32 mx-auto flex items-center justify-center rounded-full border-8 ${border}`}
      >
        <span className='text-xl font-bold'>{valor}</span>
      </div>
    </div>
  )
}
