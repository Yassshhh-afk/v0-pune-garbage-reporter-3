export function isValidServiceArea(latitude: number, longitude: number): boolean {
  // Pune city bounding box (approximately)
  const puneMinLat = 18.3
  const puneMaxLat = 18.7
  const puneMinLng = 73.6
  const puneMaxLng = 74.1

  // Pimpri-Chinchwad bounding box (approximately)
  const pcmcMinLat = 18.55
  const pcmcMaxLat = 18.75
  const pcmcMinLng = 73.75
  const pcmcMaxLng = 74.05

  const inPune = latitude >= puneMinLat && latitude <= puneMaxLat && longitude >= puneMinLng && longitude <= puneMaxLng
  const inPCMC = latitude >= pcmcMinLat && latitude <= pcmcMaxLat && longitude >= pcmcMinLng && longitude <= pcmcMaxLng

  return inPune || inPCMC
}

export function getServiceAreaError(latitude: number, longitude: number): string | null {
  if (!isValidServiceArea(latitude, longitude)) {
    return "This location is outside Pune and Pimpri-Chinchwad. This app only tracks garbage in these areas."
  }
  return null
}
