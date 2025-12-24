import { useControls } from "leva"

const Lights = () => {
  const { intensity } = useControls({
    intensity: {
      value: 0,
      min: 0,
      max: 5,
      step: 0.1
    }
  })
  return (
    <>
      <ambientLight color={'#ffffff'} intensity={intensity} />
      <directionalLight position={[3, 3, 3]} color={'#ffffff'} intensity={0} />
    </>
  )
}

export default Lights
