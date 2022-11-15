const dbService = require('../../services/db.service.js')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    update,
    remove,
    add
}

async function query() {
    try {
        const collestion = await dbService.getCollection('pet')
        var pets = await collestion.find().toArray()
        return pets
    } catch (err) {
        logger.error('cannot find pets')
        throw err
    }
}

async function getById(petId) {
    try {
        const collection = await dbService.getCollection('pet')
        const pet = await collection.findOne({ '_id': ObjectId(petId) })
        return pet
    } catch (err) {
        logger.error(`while finding pet ${petUd}`, err)
        throw err
    }
}

async function remove(petId) {
    try {
        const collection = await dbService.getCollection('pet')
        await collection.deleteOne({ '_id': ObjectId(petId) })
    } catch {
        logger.error(`cannot remove pet ${petId}`, err)
        throw err
    }
}

async function update(pet) {
    try {
        const petToSave = {
            _id: ObjectId(pet._id),
            name: pet.name,
            type: pet.type,
            breed: pet.breed,
            imgUrl: pet.imgUrl,
            gender: pet.gender,
            likes: pet.likes,
            age: pet.age,
            size: pet.size,
            color: pet.color,
            trainedLevel: pet.trainedLevel,
            isVaccinated: pet.isVaccinated,
            isSafeWithChild: pet.isSafeWithChild,
            isPlayfull: pet.isPlayfull,
            isCastrated: pet.isCastrated,
            isBirthCertificate: pet.isBirthCertificate,
            bio: pet.bio,
            owner: {
                _id: pet.owner._id,
                fullname: pet.owner.fullname
            }
        }
        const collection = await dbService.getCollection('pet')
        await collection.updateOne({ '_id': petToSave._id }, { $set: petToSave })
        console.log('petToSave:', petToSave)
        return petToSave
    } catch (err) {
        logger.error(`cannot update pet ${pet._id}`, err)
        throw err
    }
}

async function add(pet) {
    const petToAdd = {
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        gender: pet.gender,
        imgUrl: pet.imgUrl,
        likes: 1,
        age: pet.age,
        size: pet.size,
        color: pet.color,
        trainedLevel: pet.trainedLevel,
        isVaccinated: pet.isVaccinated,
        isSafeWithChild: pet.isSafeWithChild,
        isPlayfull: pet.isPlayfull,
        isCastrated: pet.isCastrated,
        isBirthCertificate: pet.isBirthCertificate,
        bio: pet.bio,
        owner: {
            _id: pet.owner._id,
            fullname: pet.owner.fullname
        }
    }
    try {
        const collection = await dbService.getCollection('pet')
        await collection.insertOne(petToAdd)
        return petToAdd
    } catch (err) {
        logger.error('cannot add pet', err)
        throw err
    }
}
