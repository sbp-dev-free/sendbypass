export interface PreviewFlightInfoProps {
  flightInfo: FlightInfo;
  className?: string;
}

export interface FlightInfo {
  origin: FlightInfoLocation;
  destination: FlightInfoLocation;
}

interface FlightInfoLocation {
  countryCode: string;
  city: string;
  country: string;
  date: string;
}
