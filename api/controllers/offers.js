'use strict'

module.exports = {
    offers,
    tripOffers
}

function tripOffers(req, res) {
    offers(req, res)
}

function offers(req, res) {
    var offerDV = {
        offerId: 'A1',
        description: 'Angebot direkter Verkehr',
        price: 22,
        links: [
            {
                rel: 'Angebot A1 vorabbuchen',
                href: 'bookings/A1/prebook'
            }
        ]
    }
    var offerSparbillett = {
        offerId: 'A2',
        description: 'Angebot Sparbillett',
        price: 12,
        links: [
            {
                rel: 'Angebot A2 vorabbuchen',
                href: 'bookings/A2/prebook'
            }
        ]
    }
    var offers = [offerDV, offerSparbillett]
    res.json(offers)
}