import axios from "axios"

function App() {
  const fetchAdafruitData = async () => {
    const ADAFRUIT_KEY = import.meta.env.VITE_ADAFRUIT_KEY
    const ADAFRUIT_USER = import.meta.env.VITE_ADAFRUIT_USERNAME

    try {
      const { data } = await axios.get(
        `https://io.adafruit.com/api/v2/${ADAFRUIT_USER}/feeds/itraffic.peatonal/data`,
        {
          headers: {
            "X-AIO-Key": ADAFRUIT_KEY
          }
        }
      )
      return data
    } catch (error) {
      console.error("Error al obtener datos de Adafruit:", error)
      throw error
    }
  }

  return (
    <>
      <h1>Hola mundo!</h1>
      <button onClick={() => fetchAdafruitData()} className='p-3 bg-red-400 rounded-xl'>
        Obtener datos!
      </button>
    </>
  )
}

export default App
