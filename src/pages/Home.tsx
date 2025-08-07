import { useEffect, useState } from "react"
import Indicator from "../components/Indicator"
import StateButton from "../components/StateButton"
import Table from "../components/Table"
import { fetchAdafruitData, toggleFeed } from "../services/adafruit"
import type { DatosSensor } from "../types"

export default function Home() {
  const [datos, setDatos] = useState<DatosSensor>({
    humedad: null,
    temperatura: null,
    gas: "",
    fuego: "No",
    intruso: "No",
    timestamp: "",
    logs: []
  })

  const fetchData = async () => {
    try {
      const data = await fetchAdafruitData()
      setDatos(data)
    } catch (err) {
      console.error("Error al obtener datos:", err)
    }
  }

  useEffect(() => {
    fetchData()
    const intervalo = setInterval(fetchData, 60000)
    return () => clearInterval(intervalo)
  }, [])

  const getValorDe = (tipo: string) => datos.logs.find((log) => log.tipo === tipo)?.valor ?? "--"

  return (
    <main className='p-6 space-y-10 bg-black min-h-screen text-white'>
      <h1 className='text-3xl font-bold'>iHome</h1>

      <section className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        <Indicator
          label='Temperatura'
          valor={getValorDe("Temperatura")}
          border='border-green-500'
        />
        <Indicator label='Humedad' valor={getValorDe("Humedad")} border='border-blue-500' />
        <StateButton
          label='Gas'
          estado={parseInt(datos.gas) === 1 ? "Sí" : "No"}
          onClick={() =>
            toggleFeed("ihouse.gases", parseInt(datos.gas) === 1 ? "Sí" : "No").then(fetchData)
          }
        />
        <StateButton
          label='Fuego'
          estado={datos.fuego}
          onClick={() => toggleFeed("ihouse.alerta-incendio", datos.fuego).then(fetchData)}
        />
        <StateButton
          label='Intruso'
          estado={datos.intruso}
          onClick={() => toggleFeed("ihouse.intrusos", datos.intruso).then(fetchData)}
        />
      </section>

      <section className='flex flex-col md:flex-row gap-6 items-start overflow-x-auto'>
        <Table
          title='Resumen de Humedad'
          type='key-value'
          rows={[
            { key: "Promedio", value: `${datos.humedad?.promedio ?? "--"}%` },
            { key: "Mínimo", value: `${datos.humedad?.min ?? "--"}%` },
            { key: "Máximo", value: `${datos.humedad?.max ?? "--"}%` }
          ]}
        />

        <Table
          title='Resumen de Temperatura'
          type='key-value'
          rows={[
            { key: "Promedio", value: `${datos.temperatura?.promedio ?? "--"}°C` },
            { key: "Mínimo", value: `${datos.temperatura?.min ?? "--"}°C` },
            { key: "Máximo", value: `${datos.temperatura?.max ?? "--"}°C` }
          ]}
        />
      </section>

      <section className='border border-gray-700 rounded-lg overflow-hidden'>
        <Table
          title='Logs Generales'
          type='full'
          headers={["Tipo", "Valor", "Estado", "Timestamp"]}
          rows={datos.logs.map((log) => [
            log.tipo,
            log.valor,
            log.estado === "ALERTA" ? (
              <span className='text-red-500'>{log.estado}</span>
            ) : (
              <span className='text-green-500'>{log.estado}</span>
            ),
            new Date(log.timestamp).toLocaleString()
          ])}
        />
      </section>
    </main>
  )
}
