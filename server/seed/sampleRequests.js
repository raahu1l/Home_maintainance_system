
const sampleRequests = [
    {
        requestId: "MR100",
        customerName: "Rahul",
        contactNumber: "9876543210",
        serviceType: "Plumbing",
        description: "Kitchen tap leakage",
        requestDate: new Date("2026-11-01"),
        estimatedCost: 800,
        technician: "Amit",
        status: "Completed",
        statusHistory: [
            { status: "Pending", note: "Request created" },
            { status: "Assigned", note: "Assigned to Amit" },
            { status: "Completed", note: "Leakage repaired" }
        ]
    },
    {
        requestId: "MR101",
        customerName: "Priya",
        contactNumber: "9876543211",
        serviceType: "Electrical",
        description: "Ceiling fan not working",
        requestDate: new Date("2026-11-02"),
        estimatedCost: 1200,
        technician: "Suresh",
        status: "In Progress"
    },
    {
        requestId: "MR102",
        customerName: "Amit",
        contactNumber: "9876543212",
        serviceType: "Cleaning",
        description: "Deep cleaning of kitchen",
        requestDate: new Date("2026-11-03"),
        estimatedCost: 1500,
        technician: "Priya",
        status: "Assigned"
    },
    {
        requestId: "MR103",
        customerName: "Sneha",
        contactNumber: "9876543213",
        serviceType: "Carpentry",
        description: "Repair bedroom cupboard",
        requestDate: new Date("2026-11-04"),
        estimatedCost: 2000,
        technician: "Ramesh",
        status: "Pending"
    },
    {
        requestId: "MR104",
        customerName: "Rahul",
        contactNumber: "9876543210",
        serviceType: "Painting",
        description: "Repaint living room wall",
        requestDate: new Date("2026-11-05"),
        estimatedCost: 3500,
        technician: null,
        status: "Pending"
    },
    {
        requestId: "MR105",
        customerName: "Priya",
        contactNumber: "9876543211",
        serviceType: "Plumbing",
        description: "Bathroom shower blockage",
        requestDate: new Date("2026-11-06"),
        estimatedCost: 600,
        technician: "Amit",
        status: "Completed"
    },
    {
        requestId: "MR106",
        customerName: "Sneha",
        contactNumber: "9876543213",
        serviceType: "Electrical",
        description: "Replace damaged switch",
        requestDate: new Date("2026-11-07"),
        estimatedCost: 450,
        technician: "Suresh",
        status: "Assigned"
    },
    {
        requestId: "MR107",
        customerName: "Amit",
        contactNumber: "9876543212",
        serviceType: "Cleaning",
        description: "Balcony cleaning",
        requestDate: new Date("2026-11-08"),
        estimatedCost: 700,
        technician: null,
        status: "Cancelled"
    },
    {
        requestId: "MR108",
        customerName: "Rahul",
        contactNumber: "9876543210",
        serviceType: "Carpentry",
        description: "Fix loose dining table leg",
        requestDate: new Date("2026-11-09"),
        estimatedCost: 900,
        technician: "Ramesh",
        status: "In Progress"
    },
    {
        requestId: "MR109",
        customerName: "Sneha",
        contactNumber: "9876543213",
        serviceType: "Painting",
        description: "Paint balcony railing",
        requestDate: new Date("2026-11-10"),
        estimatedCost: 1800,
        technician: "Ramesh",
        status: "Completed"
    },
    {
        requestId: "MR110",
        customerName: "Priya",
        contactNumber: "9876543211",
        serviceType: "Plumbing",
        description: "Water tank pipe leakage",
        requestDate: new Date("2026-11-11"),
        estimatedCost: 2200,
        technician: null,
        status: "Pending"
    },
    {
        requestId: "MR111",
        customerName: "Amit",
        contactNumber: "9876543212",
        serviceType: "Electrical",
        description: "Install new LED lights",
        requestDate: new Date("2026-11-12"),
        estimatedCost: 1600,
        technician: "Suresh",
        status: "In Progress"
    },
    {
        requestId: "MR112",
        customerName: "Rahul",
        contactNumber: "9876543210",
        serviceType: "Cleaning",
        description: "Clean water storage tank",
        requestDate: new Date("2026-11-13"),
        estimatedCost: 1100,
        technician: "Priya",
        status: "Assigned"
    },
    {
        requestId: "MR113",
        customerName: "Sneha",
        contactNumber: "9876543213",
        serviceType: "Carpentry",
        description: "Repair main door hinge",
        requestDate: new Date("2026-11-14"),
        estimatedCost: 500,
        technician: null,
        status: "Pending"
    },
    {
        requestId: "MR114",
        customerName: "Priya",
        contactNumber: "9876543211",
        serviceType: "Other",
        description: "Inspect damaged window frame",
        requestDate: new Date("2026-11-14"),
        estimatedCost: 1300,
        technician: "Ramesh",
        status: "Completed"
    }
];

console.log("Sample array length:", sampleRequests.length);

module.exports = sampleRequests;