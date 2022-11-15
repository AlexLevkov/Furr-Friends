const express = require('express')
const router = express.Router()
const { getPets, getPet, deletePet, updatePet, addPet } = require('./pet.controller')

router.get('/', getPets)
router.get('/:id', getPet)
router.put('/', updatePet)
router.delete('/:id', deletePet)
router.post('/', addPet)

module.exports = router