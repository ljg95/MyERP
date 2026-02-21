

async function seedInventory() {
    console.log("Seeding inventory data...");

    // Seed initial inventory for dummy products (assumes products 1 to 5 exist)
    const adjustments = [
        { productId: 1, quantityChanged: 50, reason: "Initial seed", referenceId: "INIT-001" },
        { productId: 2, quantityChanged: 10, reason: "Initial seed", referenceId: "INIT-001" },
        { productId: 3, quantityChanged: 100, reason: "Initial seed", referenceId: "INIT-001" },
        // productId 4 has 0 stock
        { productId: 5, quantityChanged: 200, reason: "Initial seed", referenceId: "INIT-001" },
        // Add some negative adjustments (outbound)
        { productId: 1, quantityChanged: -5, reason: "Test outbound", referenceId: "TEST-OUT-01" },
        { productId: 3, quantityChanged: -10, reason: "Test outbound", referenceId: "TEST-OUT-02" }
    ];

    for (const adj of adjustments) {
        try {
            const res = await fetch('http://localhost:8083/inventory/adjust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adj)
            });
            if (res.ok) {
                console.log(`Seeded adjustment for Product ID ${adj.productId}: ${adj.quantityChanged}`);
            } else {
                console.error(`Failed to seed for Product ID ${adj.productId}`, await res.text());
            }
        } catch (e) {
            console.error(`Error for Product ID ${adj.productId}`, e.message);
        }
    }
    console.log("Seeding complete.");
}

seedInventory();
