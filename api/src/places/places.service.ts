import { Injectable } from '@nestjs/common';
import { PlacesRepository } from './repositories/places.repository';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  constructor(private readonly placesRepository: PlacesRepository) {}

  async create(createPlaceDto: CreatePlaceDto, userId: string) {
    return this.placesRepository.create(createPlaceDto, userId);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.placesRepository.findAll(skip, limit);
  }

  async search(query: string) {
    return this.placesRepository.search(query);
  }

  async findNearby(lat: number, lng: number, radius: number) {
    return this.placesRepository.findNearby(lat, lng, radius);
  }

  async findOne(id: string) {
    return this.placesRepository.findOne(id);
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    return this.placesRepository.update(id, updatePlaceDto);
  }

  async remove(id: string) {
    return this.placesRepository.remove(id);
  }
}
