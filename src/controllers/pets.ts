import { Request, Response } from 'express';
import { Pet } from '../entities/Pet.js';
import { petIdCounter, pets } from '../models/pets.js';
import { CreatePetSchema } from '../validators/pets.js';

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
  for (const pet in pets) {
    console.log(pet);
  }
  res.status(200).json(pets);
}

export function getPet(req: Request, res: Response): void {
  const identifier = Number(req.params.petId);
  const pet = pets.find((p) => p.id === identifier);

  if (!pet) {
    res.status(404).json({ error: `Pet with ID ${identifier} not found` });
  }

  res.status(200).json(pet);
}

export function updatePet() {}

export function deletePet() {}
