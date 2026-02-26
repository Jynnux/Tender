import { Request, Response } from 'express';
import { Pet } from '../entities/Pet.js';
import { logs } from '../models/logs.js';
import { petIdCounter, pets } from '../models/pets.js';
import { CreatePetSchema } from '../validators/pets.js';
// TODO: implement status computation function

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
  const petGrowth = logs.filter((l) => l.petId === pet.id);
  // harnessing my inner yandere dev for this one
  if (petGrowth.length === 0) {
    res.status(200).json({
      pet: pet,
      stage: '🥚',
    });
  }
  if (petGrowth.length >= 1 && petGrowth.length <= 4) {
    res.status(200).json('🐣');
  }
  if (petGrowth.length >= 5 && petGrowth.length <= 14) {
    res.status(200).json('🐥');
  }
  res.status(200).json('🐓');
}

// TODO: Retrieve update and delete functions from Gab
export function updatePet() {}

export function deletePet() {}

// TODO: Finish computation function
