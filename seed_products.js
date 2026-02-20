const categories = ['Widgets', 'Gadgets', 'Components', 'Parts', 'Accessories', 'Tools'];
const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

const adjectives = ['Awesome', 'Premium', 'Eco', 'Super', 'Basic', 'Deluxe', 'Smart', 'Heavy-Duty', 'Compact', 'Pro'];
const nouns = ['Widget', 'Device', 'Tool', 'Module', 'Sensor', 'Gear', 'Component', 'Kit', 'Apparatus', 'Machine'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedProducts = async () => {
    console.log("Starting to insert 110 dummy products...");
    let successCount = 0;

    for (let i = 1; i <= 110; i++) {
        const name = `${getRandomElement(adjectives)} ${getRandomElement(nouns)} ${i}`;
        const sku = `DUMMY-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}-${i}`;
        const category = getRandomElement(categories);
        const price = (Math.random() * 500 + 10).toFixed(2);
        const stockQuantity = Math.floor(Math.random() * 200);
        const status = stockQuantity === 0 ? 'Out of Stock' : stockQuantity < 20 ? 'Low Stock' : 'In Stock';

        try {
            const response = await fetch('http://localhost:8080/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    sku,
                    category,
                    price: parseFloat(price),
                    stockQuantity,
                    status
                })
            });

            if (response.ok) {
                successCount++;
            } else {
                console.error(`Failed to insert product ${i}: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.error(`Error inserting product ${i}:`, err.message);
        }
    }

    console.log(`Finished! Successfully inserted ${successCount} products.`);
};

seedProducts();
