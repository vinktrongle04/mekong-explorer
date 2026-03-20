"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesService = void 0;
const common_1 = require("@nestjs/common");
const places_repository_1 = require("./repositories/places.repository");
let PlacesService = class PlacesService {
    placesRepository;
    constructor(placesRepository) {
        this.placesRepository = placesRepository;
    }
    async create(createPlaceDto, userId) {
        return this.placesRepository.create(createPlaceDto, userId);
    }
    async findAll(page, limit) {
        const skip = (page - 1) * limit;
        return this.placesRepository.findAll(skip, limit);
    }
    async search(query) {
        return this.placesRepository.search(query);
    }
    async findNearby(lat, lng, radius) {
        return this.placesRepository.findNearby(lat, lng, radius);
    }
    async findOne(id) {
        return this.placesRepository.findOne(id);
    }
    async update(id, updatePlaceDto) {
        return this.placesRepository.update(id, updatePlaceDto);
    }
    async remove(id) {
        return this.placesRepository.remove(id);
    }
};
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [places_repository_1.PlacesRepository])
], PlacesService);
//# sourceMappingURL=places.service.js.map