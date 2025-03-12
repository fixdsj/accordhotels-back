import { getDbConnection } from "./config/db.js";
import {fakerFR} from "@faker-js/faker";
import { Faker, fr } from '@faker-js/faker';

async function createSampleData() {
    const pool = await getDbConnection();
    const hotels = [];
    const customFaker = new Faker({ locale: fr });

    for (let i = 0; i < 50; i++) {
        const hotel = {
            name: customFaker.company.name(),
            location: customFaker.location.city() + ', ' + customFaker.location.country(),
            rating: customFaker.number.int({ min: 1, max: 5 }),
            price: customFaker.number.int({ min: 50, max: 500 }),
            description: customFaker.lorem.paragraph(),
            picture: customFaker.image.urlPicsumPhotos( {width: 800, height: 600} ),
            amenities: customFaker.helpers.arrayElements(['wifi', 'pool', 'gym', 'parking', 'restaurant']).join(', '),
            capacity: customFaker.number.int({ min: 1, max: 100 })
        };
        hotels.push(hotel);
    }
    //ajouter un hotel à Paris necessaire pour les tests
    hotels.push({
        name: "Hotel Paris",
        location: "Paris, France",
        rating: 5,
        price: 500,
        description: "Hotel de luxe à Paris",
        picture: "https://picsum.photos/800/600",
        amenities: "wifi, pool, gym, parking, restaurant",
        capacity: 100
    });

    const insertHotelsQuery = "INSERT INTO hotels (name, location, rating, price, description, picture, amenities, capacity) VALUES ?";
    const values = hotels.map(hotel => [
        hotel.name,
        hotel.location,
        hotel.rating,
        hotel.price,
        hotel.description,
        hotel.picture,
        hotel.amenities,
        hotel.capacity
    ]);

    await pool.query(insertHotelsQuery, [values]);
    console.log("Sample data created successfully!");
}

createSampleData().catch(console.error);
