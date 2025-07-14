import { useState } from "react"

function App() {
  const resumenHumedad = [45, 53, 38, 51]
  const timestamp = "2025-07-13T12:39:40Z"
  const promedio = (resumenHumedad.reduce((a, b) => a + b) / resumenHumedad.length).toFixed(2)
  const minimo = Math.min(...resumenHumedad)
  const maximo = Math.max(...resumenHumedad)

  const logsGenerales = [
    { tipo: "Humedad", valor: "53%", estado: "OK", timestamp: "2025-07-13T12:36:10Z" },
    { tipo: "Temperatura", valor: "24°C", estado: "OK", timestamp: "2025-07-13T12:36:12Z" },
    { tipo: "Gas", valor: "420 ppm", estado: "ALERTA", timestamp: "2025-07-13T12:37:00Z" },
    { tipo: "Fuego", valor: "-", estado: "Inactivo", timestamp: "2025-07-13T12:38:00Z" },
    { tipo: "Intruso", valor: "-", estado: "Detectado", timestamp: "2025-07-13T12:39:10Z" }
  ]

  const [fuego, setFuego] = useState<"Sí" | "No">("No")
  const [intruso, setIntruso] = useState<"Sí" | "No">("No")

  return (
    <main className='p-6 space-y-10 bg-black min-h-screen text-white'>
      <h1 className='text-3xl font-bold'>Panel Ambiental</h1>

      {/* Indicadores */}
      <section className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        <Indicador label='Temperatura' valor='24°C' border='border-green-500' />
        <Indicador label='Humedad' valor='77%' border='border-blue-500' />
        <Indicador label='Gas' valor='420ppm' border='border-yellow-500' />
        <BotonEstado
          label='Fuego'
          estado={fuego}
          onClick={() => setFuego(fuego === "Sí" ? "No" : "Sí")}
        />
        <BotonEstado
          label='Intruso'
          estado={intruso}
          onClick={() => setIntruso(intruso === "Sí" ? "No" : "Sí")}
        />
      </section>

      {/* Tablas lado a lado */}
      {/* Tablas lado a lado, responsive */}
      <section className='flex flex-col md:flex-row gap-6 items-start overflow-x-auto'>
        {/* Resumen de humedad */}
        <div className='flex-1 border border-gray-700 rounded-lg overflow-hidden self-start'>
          <h2 className='text-xl font-semibold px-4 py-2 bg-gray-800 border-b border-gray-700'>
            Resumen de Humedad
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm bg-gray-900'>
              <tbody className='divide-y divide-gray-700'>
                <tr>
                  <td className='px-4 py-2'>Promedio</td>
                  <td className='px-4 py-2'>{promedio}%</td>
                </tr>
                <tr>
                  <td className='px-4 py-2'>Mínimo</td>
                  <td className='px-4 py-2'>{minimo}%</td>
                </tr>
                <tr>
                  <td className='px-4 py-2'>Máximo</td>
                  <td className='px-4 py-2'>{maximo}%</td>
                </tr>
                <tr>
                  <td className='px-4 py-2'>Última actualización</td>
                  <td className='px-4 py-2'>{new Date(timestamp).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Logs generales */}
        <div className='flex-1 border border-gray-700 rounded-lg overflow-hidden'>
          <h2 className='text-xl font-semibold px-4 py-2 bg-gray-800 border-b border-gray-700'>
            Logs de Eventos
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm bg-gray-900'>
              <thead className='text-gray-400 uppercase text-xs bg-gray-800 border-b border-gray-700'>
                <tr>
                  <th className='px-4 py-2 text-left'>Sensor</th>
                  <th className='px-4 py-2 text-left'>Valor</th>
                  <th className='px-4 py-2 text-left'>Estado</th>
                  <th className='px-4 py-2 text-left'>Timestamp</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-700'>
                {logsGenerales.map((log, index) => (
                  <tr key={index}>
                    <td className='px-4 py-2'>{log.tipo}</td>
                    <td className='px-4 py-2'>{log.valor}</td>
                    <td
                      className={`px-4 py-2 font-bold ${
                        log.estado === "OK"
                          ? "text-green-400"
                          : log.estado === "Inactivo"
                            ? "text-gray-400"
                            : "text-red-500"
                      }`}
                    >
                      {log.estado}
                    </td>
                    <td className='px-4 py-2'>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

// Indicador circular estático
function Indicador({ label, valor, border }: { label: string; valor: string; border: string }) {
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

// Botón de estado visual e interactivo
function BotonEstado({
  label,
  estado,
  onClick
}: {
  label: string
  estado: "Sí" | "No"
  onClick?: () => void
}) {
  const isActive = estado === "Sí"
  const color = isActive
    ? "border-red-500 bg-red-700" // SI → peligro → rojo
    : "border-green-500 bg-green-700" // NO → seguro → verde

  return (
    <div className='bg-gray-900 rounded-lg p-4 border border-gray-700 text-center'>
      <h2 className='text-sm mb-2'>{label}</h2>
      <button
        onClick={onClick}
        className={`w-32 h-32 mx-auto flex items-center justify-center rounded-full border-8 ${color} transition-colors duration-300`}
      >
        <span className='text-xl font-bold'>{estado}</span>
      </button>
    </div>
  )
}

export default App
