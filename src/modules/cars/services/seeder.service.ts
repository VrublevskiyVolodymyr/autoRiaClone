import { Injectable } from '@nestjs/common';

import { ProducerEntity } from '../../../database/entities/producer.entity';
import { ModelRepository } from '../../repository/services/model.repository';
import { ProducerRepository } from '../../repository/services/producer.repository';
import { RegionRepository } from '../../repository/services/region.repository';

@Injectable()
export class SeederService {
  constructor(
    private readonly producerRepository: ProducerRepository,
    private readonly modelRepository: ModelRepository,
    private readonly regionRepository: RegionRepository,
  ) {}

  async seedData() {
    await this.seedProducersAndModels();
    await this.seedRegions();
  }

  private async seedProducersAndModels() {
    const producersWithModels = [
      { producer: 'Audi', models: ['A3', 'A4', 'Q5', 'Q7', 'A6', 'R8'] },
      {
        producer: 'BMW',
        models: ['X1', 'X5', 'M3', 'Series 3', 'Series 5', 'Series 7'],
      },
      {
        producer: 'Chevrolet',
        models: ['Cruze', 'Malibu', 'Suburban', 'Tahoe', 'Camaro', 'Impala'],
      },
      {
        producer: 'Ford',
        models: ['Focus', 'Fiesta', 'Explorer', 'Mustang', 'Fusion', 'Escape'],
      },
      {
        producer: 'Honda',
        models: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Odyssey'],
      },
      {
        producer: 'Hyundai',
        models: ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Kona', 'Accent'],
      },
      {
        producer: 'Kia',
        models: ['Rio', 'Sorento', 'Sportage', 'Optima', 'Stinger', 'Seltos'],
      },
      { producer: 'Lexus', models: ['RX', 'ES', 'NX', 'LS', 'GX', 'LX'] },
      { producer: 'Mazda', models: ['Mazda3', 'CX-5', 'MX-5', 'CX-9', 'CX-3'] },
      {
        producer: 'Mercedes-Benz',
        models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class'],
      },
      {
        producer: 'Mitsubishi',
        models: ['Outlander', 'Lancer', 'Pajero', 'Eclipse Cross', 'ASX'],
      },
      {
        producer: 'Nissan',
        models: ['Altima', 'Maxima', 'Rogue', 'Murano', 'Sentra', 'Leaf'],
      },
      {
        producer: 'Opel',
        models: ['Astra', 'Insignia', 'Corsa', 'Zafira', 'Mokka'],
      },
      { producer: 'Peugeot', models: ['208', '3008', '508', '2008', '5008'] },
      {
        producer: 'Renault',
        models: ['Clio', 'Megane', 'Koleos', 'Kadjar', 'Twingo'],
      },
      {
        producer: 'Skoda',
        models: ['Octavia', 'Fabia', 'Kodiaq', 'Superb', 'Karoq'],
      },
      {
        producer: 'Toyota',
        models: ['Camry', 'Corolla', 'Highlander', 'RAV4', 'Land Cruiser'],
      },
      {
        producer: 'Tesla',
        models: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
      },
      {
        producer: 'Volkswagen',
        models: ['Golf', 'Passat', 'Tiguan', 'Polo', 'Touareg'],
      },
      { producer: 'Volvo', models: ['XC60', 'XC90', 'S60', 'V60', 'S90'] },
      { producer: 'VAZ / Lada', models: ['2101', '2107', 'Niva', 'Granta'] },
    ];

    for (const producerData of producersWithModels) {
      const producerExists = await this.producerRepository.isProducerExist(
        this.capitalizeFirstLetter(producerData.producer),
      );

      let producer: ProducerEntity;
      if (!producerExists) {
        producer = this.producerRepository.create({
          producer: producerData.producer,
        });
        producer = await this.producerRepository.save(producer);
      } else {
        producer = await this.producerRepository.findOne({
          where: { producer: producerData.producer },
        });
      }

      for (const modelName of producerData.models) {
        const modelExists = await this.modelRepository.isModelExist(modelName);

        if (!modelExists) {
          const model = this.modelRepository.create({
            model: modelName,
            producer,
          });
          await this.modelRepository.save(model);
        }
      }
    }
  }

  private async seedRegions() {
    const regions = [
      'Vinnytsia Region',
      'Volyn Region',
      'Dnipropetrovsk Region',
      'Donetsk Region',
      'Zhytomyr Region',
      'Zakarpattia Region',
      'Zaporizhzhia Region',
      'Ivano-Frankivsk Region',
      'Kirovohrad Region',
      'Luhansk Region',
      'Lviv Region',
      'Mykolaiv Region',
      'Odesa Region',
      'Poltava Region',
      'Rivne Region',
      'Sumy Region',
      'Ternopil Region',
      'Kharkiv Region',
      'Kherson Region',
      'Khmelnytskyi Region',
      'Cherkasy Region',
      'Chernivtsi Region',
      'Chernihiv Region',
      'Vinnytsia',
      'Lutsk',
      'Dnipro',
      'Donetsk',
      'Zhytomyr',
      'Uzhhorod',
      'Zaporizhzhia',
      'Ivano-Frankivsk',
      'Kropyvnytskyi',
      'Luhansk',
      'Lviv',
      'Kyiv',
      'Mykolaiv',
      'Odesa',
      'Poltava',
      'Rivne',
      'Sumy',
      'Ternopil',
      'Kharkiv',
      'Kherson',
      'Khmelnytskyi',
      'Cherkasy',
      'Chernivtsi',
      'Chernihiv',
    ];

    for (const regionName of regions) {
      const regionExists =
        await this.regionRepository.isRegionExist(regionName);

      if (!regionExists) {
        const region = this.regionRepository.create({ region: regionName });
        await this.regionRepository.save(region);
      }
    }
  }

  capitalizeFirstLetter(word: string): string {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
