import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './restaurants/schemas/restaurant.schema';
import { Category } from './menu/schemas/category.schema';
import { Item } from './menu/schemas/item.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const restaurantModel = app.get<Model<Restaurant>>(getModelToken(Restaurant.name));
    const categoryModel = app.get<Model<Category>>(getModelToken(Category.name));
    const itemModel = app.get<Model<Item>>(getModelToken(Item.name));

    console.log('Clearing existing data...');
    await restaurantModel.deleteMany({});
    await categoryModel.deleteMany({});
    await itemModel.deleteMany({});

    console.log('Existing data cleared.');

    const mockRestaurants = [
        {
            name: 'Burger Joint',
            description: 'Best burgers in town',
            address: '123 Main St, Springfield',
            location: { type: 'Point', coordinates: [-77.0369, 38.9072] }, // longitude, latitude
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ownerId: 'mock-owner-1',
            cuisineType: 'American',
            openingTime: '10:00 AM',
            closingTime: '10:00 PM',
            isOpen: true
        },
        {
            name: 'Pizzeria Napoli',
            description: 'Authentic Italian pizza',
            address: '456 Oak Avenue, Springfield',
            location: { type: 'Point', coordinates: [-77.0359, 38.9082] },
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ownerId: 'mock-owner-2',
            cuisineType: 'Italian',
            openingTime: '11:00 AM',
            closingTime: '11:00 PM',
            isOpen: true
        },
        {
            name: 'Sushi Zen',
            description: 'Fresh sushi and sashmini daily',
            address: '789 Pine Road, Springfield',
            location: { type: 'Point', coordinates: [-77.0349, 38.9092] },
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ownerId: 'mock-owner-3',
            cuisineType: 'Japanese',
            openingTime: '12:00 PM',
            closingTime: '10:30 PM',
            isOpen: false
        },
        {
            name: 'Taco Fiesta',
            description: 'Spicy and authentic Mexican street food',
            address: '321 Elm Street, Springfield',
            location: { type: 'Point', coordinates: [-77.0379, 38.9062] },
            rating: 4.3,
            imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ownerId: 'mock-owner-4',
            cuisineType: 'Mexican',
            openingTime: '09:00 AM',
            closingTime: '09:00 PM',
            isOpen: true
        },
        {
            name: 'Green Bowl Salads',
            description: 'Healthy and organic salad bowls',
            address: '555 Cedar Lane, Springfield',
            location: { type: 'Point', coordinates: [-77.0389, 38.9052] },
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ownerId: 'mock-owner-5',
            cuisineType: 'Healthy',
            openingTime: '08:00 AM',
            closingTime: '08:00 PM',
            isOpen: true
        }
    ];

    console.log('Seeding restaurants...');
    const insertedRestaurants = await restaurantModel.insertMany(mockRestaurants);

    console.log(`Inserted ${insertedRestaurants.length} restaurants.`);

    console.log('Seeding menus...');
    for (const restaurant of insertedRestaurants) {
        // Create 2 categories per restaurant
        const categories = [
            { name: 'Mains', restaurantId: restaurant._id },
            { name: 'Sides & Drinks', restaurantId: restaurant._id }
        ];
        
        const insertedCategories = await categoryModel.insertMany(categories);
        
        let items = [];
        if (restaurant.name === 'Burger Joint') {
            items = [
                { name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato', price: 8.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
                { name: 'Double Bacon Burger', description: 'Two patties, bacon, double cheese', price: 12.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id, imageUrl: 'https://images.unsplash.com/photo-1594212691516-436f2f9c5d08?auto=format&fit=crop&w=400&q=80' },
                { name: 'French Fries', description: 'Crispy golden fries', price: 3.99, categoryId: insertedCategories[1]._id, restaurantId: restaurant._id },
                { name: 'Cola', description: 'Chilled soda', price: 1.99, categoryId: insertedCategories[1]._id, restaurantId: restaurant._id }
            ];
        } else if (restaurant.name === 'Pizzeria Napoli') {
            items = [
                { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 14.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id, imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400&q=80' },
                { name: 'Pepperoni Pizza', description: 'Classic pepperoni', price: 16.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80' },
                { name: 'Garlic Bread', description: 'Toasted with garlic butter', price: 5.99, categoryId: insertedCategories[1]._id, restaurantId: restaurant._id }
            ];
        } else if (restaurant.name === 'Sushi Zen') {
            items = [
                { name: 'Salmon Nigiri', description: '2 pieces fresh salmon on rice', price: 6.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id, imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=400&q=80' },
                { name: 'Spicy Tuna Roll', description: '8 pieces classic roll', price: 8.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80' },
                { name: 'Miso Soup', description: 'Traditional warm soup', price: 3.50, categoryId: insertedCategories[1]._id, restaurantId: restaurant._id }
            ];
        } else {
            // General generic items
            items = [
                { name: 'House Special', description: 'Chef\'s signature dish', price: 15.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id },
                { name: 'Signature Bowl', description: 'A hearty meal', price: 13.99, categoryId: insertedCategories[0]._id, restaurantId: restaurant._id },
                { name: 'Side Salad', description: 'Fresh greens', price: 4.99, categoryId: insertedCategories[1]._id, restaurantId: restaurant._id }
            ];
        }
        
        await itemModel.insertMany(items);
    }
    
    console.log('Seeding completed successfully!');
    process.exit(0);
}

bootstrap();
