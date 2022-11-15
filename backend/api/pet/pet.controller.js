const petService = require('./pet.service')
const logger = require('../../services/logger.service')

module.exports = {
    getPet,
    getPets,
    deletePet,
    updatePet,
    addPet
}

async function getPet(req, res) {
    try {
        const pet = await petService.getById(req.params.id)
        res.send(pet)
    } catch {
        logger.error('Failed to get Pet', err)
        res.status(500).send({ err: 'Failed to get pet' })
    }
}


async function getPets(req, res) {    
    try {
        const pets = await petService.query()
        res.send(pets)
    } catch (err) {
        logger.error('Failed to get pets', err)
        res.status(500).send({ err: 'Failed to get pets' })
    }
}

async function deletePet(req, res) {
    try {
        await petService.remove(req.params.id)
        res.send({ msg: 'Deleted successfuly' })
    } catch (err) {
        logger.error({ err: 'Faild to delete pet' })
        res.status(500).send({ err: 'Faild to delete pet' })
    }
}

async function updatePet(req, res) {
    try {
        const pet = req.body
        const savedPet = await petService.update(pet)
        res.send(savedPet)
    } catch (err) {
        logger.error('Faild to update pet', err)
        res.status(500).send({ err: 'Faild to update pet' })
    }
}

async function addPet(req, res) {
    try {
        const pet = req.body
        const petToAdd = await petService.add(pet)
        res.send(petToAdd)
    } catch (err) {
        logger.error('Failed to add pet', err)
        res.status(500).send({ err: 'Failed to add pet' })
    }
}