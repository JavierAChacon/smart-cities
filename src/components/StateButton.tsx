type Props = {
  label: string
  estado: "Sí" | "No"
  onClick?: () => void
}

export default function StateButton({ label, estado, onClick }: Props) {
  const isActive = estado === "Sí"
  const color = isActive ? "border-red-500 bg-red-700" : "border-green-500 bg-green-700"

  return (
    <div className='bg-gray-900 rounded-lg p-4 border border-gray-700 text-center'>
      <h2 className='text-sm mb-2'>{label}</h2>
      <button
        onClick={onClick}
        className={`w-32 h-32 mx-auto flex items-center justify-center rounded-full border-8 ${color}`}
      >
        <span className='text-xl font-bold'>{estado}</span>
      </button>
    </div>
  )
}
