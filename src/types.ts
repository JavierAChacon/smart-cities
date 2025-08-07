export type DatoAdafruit = {
  value: string
  created_at: string
}

export type ResumenSensor = {
  promedio: string
  min: number
  max: number
}

export type Log = {
  tipo: string
  valor: string
  estado: "OK" | "ALERTA"
  timestamp: string
}

export type DatosSensor = {
  humedad: ResumenSensor | null
  temperatura: ResumenSensor | null
  gas: string
  fuego: "Sí" | "No"
  intruso: "Sí" | "No"
  timestamp: string
  logs: Log[]
}
