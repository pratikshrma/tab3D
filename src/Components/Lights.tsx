const Lights = () => {

    return (
    <>
      <ambientLight color={'#ffffff'} intensity={0} />
      <directionalLight position={[3, 3, 3]} color={'#ffffff'} intensity={0} />
    </>
  )
}

export default Lights
