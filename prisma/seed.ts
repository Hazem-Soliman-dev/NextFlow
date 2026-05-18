import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "Nexflow Demo Corp",
      logo: "https://ui-avatars.com/api/?name=Nexflow&background=6366f1&color=fff",
    },
  });

  // 2. Create Users for each Role
  const roles = [
    { role: "ADMIN", name: "Alice Admin", email: "admin@nexflow.app" },
    { role: "MANAGER", name: "Mark Manager", email: "manager@nexflow.app" },
    { role: "SALES_REP", name: "Sarah Sales", email: "sales@nexflow.app" },
    { role: "WAREHOUSE", name: "Wally Warehouse", email: "warehouse@nexflow.app" },
    { role: "ACCOUNTANT", name: "Annie Accountant", email: "accountant@nexflow.app" },
  ];

  const createdUsers = [];
  for (const user of roles) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        role: user.role as any,
        organizationId: org.id,
        avatarUrl: `https://ui-avatars.com/api/?name=${user.name.split(" ").join("+")}&background=random`,
      },
    });
    createdUsers.push(createdUser);
  }

  const salesRep = createdUsers.find(u => u.role === "SALES_REP")!;
  const manager = createdUsers.find(u => u.role === "MANAGER")!;

  // 3. Create Contacts
  console.log("Creating contacts...");
  const contactsData = [
    { name: "John Doe", email: "john@acme.com", company: "Acme Corp", phone: "555-0101", tags: ["Client", "VIP"] },
    { name: "Jane Smith", email: "jane@globex.com", company: "Globex", phone: "555-0102", tags: ["Prospect"] },
    { name: "Bob Johnson", email: "bob@initech.com", company: "Initech", phone: "555-0103", tags: ["Partner"] },
    // Adding a few more for realism
    { name: "Alice Williams", email: "alice@hooli.com", company: "Hooli", phone: "555-0104", tags: ["Client"] },
    { name: "Charlie Brown", email: "charlie@stark.com", company: "Stark Industries", phone: "555-0105", tags: ["Lead"] },
  ];

  const createdContacts = [];
  for (const contact of contactsData) {
    const c = await prisma.contact.create({ data: contact });
    createdContacts.push(c);
  }

  // 4. Create Deals
  console.log("Creating deals...");
  const stages = ["LEAD", "QUALIFIED", "PROPOSAL", "WON", "LOST"];
  for (let i = 0; i < 15; i++) {
    const contact = createdContacts[i % createdContacts.length];
    await prisma.deal.create({
      data: {
        title: `Deal ${i + 1} with ${contact.company}`,
        value: Math.floor(Math.random() * 50000) + 5000,
        stage: stages[Math.floor(Math.random() * stages.length)] as any,
        contactId: contact.id,
        assignedToId: i % 2 === 0 ? salesRep.id : manager.id,
      },
    });
  }

  // 5. Create Suppliers
  console.log("Creating suppliers...");
  const supplier1 = await prisma.supplier.create({
    data: { name: "TechParts Inc.", email: "sales@techparts.com" }
  });
  const supplier2 = await prisma.supplier.create({
    data: { name: "Global Logistics", email: "contact@globallog.com" }
  });

  // 6. Create Products
  console.log("Creating products...");
  const categories = ["Electronics", "Furniture", "Office Supplies"];
  const createdProducts = [];
  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Product ${i + 1}`,
        sku: `SKU-${1000 + i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 1000) + 10,
        stock: Math.floor(Math.random() * 100),
        threshold: 20,
        supplierId: i % 2 === 0 ? supplier1.id : supplier2.id,
        imageUrl: `https://picsum.photos/seed/${i}/200/200`,
      },
    });
    createdProducts.push(product);
  }

  // 7. Create Invoices
  console.log("Creating invoices...");
  const invoiceStatuses = ["DRAFT", "SENT", "PAID", "OVERDUE"];
  for (let i = 0; i < 10; i++) {
    const contact = createdContacts[i % createdContacts.length];
    const status = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)] as any;
    const subtotal = Math.floor(Math.random() * 10000) + 500;
    
    const invoice = await prisma.invoice.create({
      data: {
        number: `INV-${2026}${String(i + 1).padStart(3, '0')}`,
        contactId: contact.id,
        status,
        subtotal,
        taxRate: 0.1,
        taxAmount: subtotal * 0.1,
        total: subtotal * 1.1,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdById: manager.id,
      },
    });

    // Add some line items
    for (let j = 0; j < 2; j++) {
      const product = createdProducts[(i + j) % createdProducts.length];
      const qty = Math.floor(Math.random() * 5) + 1;
      await prisma.invoiceLineItem.create({
        data: {
          invoiceId: invoice.id,
          productId: product.id,
          description: product.name,
          quantity: qty,
          unitPrice: product.price,
          total: qty * product.price,
        }
      });
    }
  }

  // 8. Create Activities
  console.log("Creating activities...");
  for (let i = 0; i < 20; i++) {
    const contact = createdContacts[i % createdContacts.length];
    await prisma.activity.create({
      data: {
        type: i % 3 === 0 ? "CALL" : "NOTE",
        content: `Followed up with ${contact.name} regarding the recent proposal.`,
        contactId: contact.id,
        userId: salesRep.id,
      }
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
