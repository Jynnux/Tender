import { Request, Response } from 'express';
import { Pet } from '../entities/Pet.js';
import { logs } from '../models/logs.js';
import { petIdCounter, pets } from '../models/pets.js';
import { CreatePetSchema, UpdatePetSchema } from '../validators/pets.js';

export function displayPet(req: Request, res: Response, pet: Pet): void {
  const petGrowth = logs.filter((l) => l.petId === pet.id);
  // harnessing my inner yandere dev for this one
  if (petGrowth.length === 0) {
    res.status(200).json({
      pet: pet,
      stage: '🥚',
    });
  }
  if (petGrowth.length >= 1 && petGrowth.length <= 4) {
    res.status(200).json({
      pet: pet,
      stage: '🐣',
    });
  }
  if (petGrowth.length >= 5 && petGrowth.length <= 14) {
    res.status(200).json({
      pet: pet,
      stage: '🐥',
    });
  }
  res.status(200).json({
    pet: pet,
    stage: '🐓',
  });
}

export function createPet(req: Request, res: Response): void {
  const result = CreatePetSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newPet: Pet = {
    id: petIdCounter.value++,
    name: result.data.name,
    species: result.data.species,
    happiness: 50,
    hunger: 50,
    energy: 50,
    lastFedAt: new Date(),
  };

  pets.push(newPet);
  res.status(201).json(newPet);
}

export function getPets(req: Request, res: Response): void {
  let filteredPets = pets;
  if (req.query.species) {
    filteredPets = filteredPets.filter((pet) => pet.species === req.query.species);
  }
  if (req.query.happiness) {
    filteredPets = filteredPets.filter(
      (pet) => Number(pet.happiness) >= Number(req.query.happiness),
    );
  }

  res.status(200).json(filteredPets);
}

export function getPet(req: Request, res: Response): void {
  const identifier = Number(req.params.petId);
  const pet = pets.find((p) => p.id === identifier);

  if (!pet) {
    res.status(404).json({ error: `Pet with ID ${identifier} not found` });
  }
  // made my json tree into a function. surely this is allowed
  displayPet(req, res, pet);
}

export function updatePet(req: Request, res: Response): void {
  const result = UpdatePetSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const petId = Number(req.params.petId);
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  pet.name = result.data.name;

  displayPet(req, res, pet);
  return;
}

export function deletePet(req: Request, res: Response): void {
  const petId = Number(req.params.petId);

  const index = pets.findIndex((p) => p.id === petId);

  if (index === -1) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  pets.splice(index, 1);

  res.status(204).send(); // 204; Successful call, nothing else to send
  return;
}
