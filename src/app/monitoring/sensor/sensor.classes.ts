export class SensorMeasure {
  public constructor(public value: number, public timestamp: number) { }
}


export class SensorMeasureTypeDetails {
  constructor(public typeName: string, public unitName: string, public unitSymbol: string) { }
}

export enum SensorMeasureType { TEMPERATURE, HUMIDITY, PRESSURE }

export class SensorMeasureMetaData {
  private static typeDetails  = {
     TEMPERATURE : new SensorMeasureTypeDetails('Temperature', 'Degree Celcius', '°C'),
     HUMIDITY :  new SensorMeasureTypeDetails('Humidity', 'Percentage', '%'),
     PRESSURE : new SensorMeasureTypeDetails('Pressure', 'Hecto-Pascal', 'hPa')
   };

  public constructor(public location: string, public type: SensorMeasureType) { }

  public static getTypeDetail(type: SensorMeasureType):  SensorMeasureTypeDetails {
      return SensorMeasureMetaData.typeDetails[type];
  }
}
