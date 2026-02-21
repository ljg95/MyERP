const partners = [
    {
        name: 'Acme Corp',
        type: 'Supplier',
        contactPerson: 'John Smith',
        email: 'john@acme.com',
        phone: '+1 (555) 123-4567',
        address: '123 Industry Way, Tech City',
        status: 'Active'
    },
    {
        name: 'Global Logistics',
        type: 'Logistics',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@globallog.com',
        phone: '+1 (555) 987-6543',
        address: '456 Shipping Ln, Harbor Town',
        status: 'Active'
    },
    {
        name: 'TechParts Inc',
        type: 'Supplier',
        contactPerson: 'Mike Brown',
        email: 'mike@techparts.com',
        phone: '+1 (555) 456-7890',
        address: '789 Circuit Blvd, Silicon Valley',
        status: 'Inactive'
    },
    {
        name: 'QuickRetail Solutions',
        type: 'Customer',
        contactPerson: 'Emily Davis',
        email: 'emily@quickretail.com',
        phone: '+1 (555) 222-3333',
        address: '321 Market St, Commerce City',
        status: 'Active'
    },
    {
        name: '대한통운 특송',
        type: 'Logistics',
        contactPerson: '김물류',
        email: 'hello@logistics.kr',
        phone: '010-1111-2222',
        address: '서울특별시 중구 물류대로 10',
        status: 'Active'
    },
    {
        name: 'ABC 전자',
        type: 'Customer',
        contactPerson: '이영업',
        email: 'sales@abcelec.com',
        phone: '02-333-4444',
        address: '경기도 수원시 영통구 디지털로 5',
        status: 'Active'
    }
];

async function seedData() {
    console.log('--- Seeding Partner Data... ---');
    for (const partner of partners) {
        try {
            const res = await fetch('http://localhost:8080/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partner)
            });
            if (res.ok) {
                console.log(`Successfully created: ${partner.name}`);
            } else {
                console.error(`Failed to create: ${partner.name}`);
            }
        } catch (e) {
            console.error(e);
        }
    }
    console.log('--- Seding completed ---');
}

seedData();
