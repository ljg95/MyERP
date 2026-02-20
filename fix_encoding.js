const updateProducts = async () => {
    try {
        await fetch('http://localhost:8080/products/2', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: '이재권 테스트 2',
                sku: 'PROD-4352',
                category: 'Gadgets',
                price: 299.99,
                stockQuantity: 12,
                status: 'Low Stock'
            })
        });

        await fetch('http://localhost:8080/products/3', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: '이재권 테스트',
                sku: 'PROD-6106',
                category: 'Widgets',
                price: 150.00,
                stockQuantity: 20,
                status: 'In Stock'
            })
        });

        console.log("Updates completed successfully.");
    } catch (e) {
        console.error(e);
    }
};

updateProducts();
