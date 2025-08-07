import axios from "axios"
import type { DatoAdafruit, ResumenSensor, Log, DatosSensor } from "../types"

const AIO_USERNAME = import.meta.env.VITE_ADAFRUIT_IO_USERNAME
const AIO_KEY = import.meta.env.VITE_ADAFRUIT_IO_KEY

const api = axios.create({
  baseURL: `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/`,
  headers: {
    "X-AIO-Key": AIO_KEY,
    "Content-Type": "application/json"
  }
})

const getHumedad = async (): Promise<DatoAdafruit[]> => {
  const res = await api.get("ihouse.humedad/data?limit=1000")
  console.log("💧 Humedad data:", res.data)
  return res.data
}

const getTemperatura = async (): Promise<DatoAdafruit[]> => {
  const res = await api.get("ihouse.temperatura/data?limit=1000")
  console.log("🌡️ Temperatura data:", res.data)
  return res.data
}

const getGas = async (): Promise<DatoAdafruit> => {
  const res = await api.get("ihouse.gases/data/last")
  console.log("🧪 Gas data:", res.data)
  return res.data
}

const getFuego = async (): Promise<DatoAdafruit> => {
  const res = await api.get("ihouse.alerta-incendio/data/last")
  console.log("🔥 Fuego data:", res.data)
  return res.data
}

const getIntruso = async (): Promise<DatoAdafruit> => {
  const res = await api.get("ihouse.intrusos/data/last")
  console.log("🚨 Intruso data:", res.data)
  return res.data
}

const extraerValores = (data: DatoAdafruit[]): number[] =>
  data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v))

const resumenDe = (arr: number[]): ResumenSensor | null =>
  arr.length > 0
    ? {
        promedio: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2),
        min: Math.min(...arr),
        max: Math.max(...arr)
      }
    : null

export const fetchAdafruitData = async (): Promise<DatosSensor> => {
  try {
    const humedadData = await getHumedad()
    const tempData = await getTemperatura()
    const gasData = await getGas()
    const fuegoData = await getFuego()
    const intrusoData = await getIntruso()

    const humedad = extraerValores(humedadData)
    const temperatura = extraerValores(tempData)

    const logs: Log[] = [
      {
        tipo: "Humedad",
        valor: `${humedad.at(-1) ?? "--"}%`,
        estado: "OK",
        timestamp: humedadData[0]?.created_at ?? "--"
      },
      {
        tipo: "Temperatura",
        valor: `${temperatura.at(-1) ?? "--"}°C`,
        estado: "OK",
        timestamp: tempData[0]?.created_at ?? "--"
      },
      {
        tipo: "Gas",
        valor: `${gasData.value} ppm`,
        estado: parseInt(gasData.value) > 400 ? "ALERTA" : "OK",
        timestamp: gasData.created_at
      }
    ]

    return {
      humedad: resumenDe(humedad),
      temperatura: resumenDe(temperatura),
      gas: `${gasData.value} ppm`,
      fuego: fuegoData.value === "1" ? "Sí" : "No",
      intruso: intrusoData.value === "1" ? "Sí" : "No",
      timestamp: humedadData[0]?.created_at ?? "--",
      logs
    }
  } catch (err) {
    console.error("❌ Error al obtener datos de Adafruit:", err)
    throw err
  }
}

export const toggleFeed = async (feedKey: string, estadoActual: "Sí" | "No") => {
  const nuevoValor = estadoActual === "Sí" ? "0" : "1"
  try {
    await api.post(`${feedKey}/data`, { value: nuevoValor })
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } catch (err) {
    console.error("❌ Error en toggleFeed:", err)
  }
}
