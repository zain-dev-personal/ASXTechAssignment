List<Product__c> products = new List<Product__c>{
    new Product__c(Name = 'MacBook Pro 16"', Category__c = 'Hardware', Unit_Price__c = 3999, Active__c = true, Description__c = 'High-performance laptop for professionals.'),
    new Product__c(Name = 'Salesforce Unlimited Edition', Category__c = 'Software', Unit_Price__c = 300, Active__c = true, Description__c = 'The most powerful CRM edition.'),
    new Product__c(Name = 'Premium Support Service', Category__c = 'Service', Unit_Price__c = 500, Active__c = true, Description__c = '24/7 dedicated support for your business.'),
    new Product__c(Name = 'Logitech MX Master 3S', Category__c = 'Hardware', Unit_Price__c = 169, Active__c = true, Description__c = 'Advanced wireless ergonomic mouse.'),
    
    // Hardware
    new Product__c(Name = 'Dell UltraSharp 27 Monitor', Category__c = 'Hardware', Unit_Price__c = 450, Active__c = true, Description__c = '27-inch 4K USB-C monitor.'),
    new Product__c(Name = 'Keychron Q1 Pro', Category__c = 'Hardware', Unit_Price__c = 210, Active__c = true, Description__c = 'Custom wireless mechanical keyboard.'),
    new Product__c(Name = 'Apple iPad Pro 12.9"', Category__c = 'Hardware', Unit_Price__c = 1099, Active__c = true, Description__c = 'M2 chip, Liquid Retina XDR display.'),
    new Product__c(Name = 'Lenovo ThinkPad X1 Carbon', Category__c = 'Hardware', Unit_Price__c = 1599, Active__c = true, Description__c = 'Business class ultrabook.'),
    new Product__c(Name = 'Epson EcoTank ET-4760', Category__c = 'Hardware', Unit_Price__c = 399, Active__c = false, Description__c = 'All-in-one cartridge-free printer.'),
    new Product__c(Name = 'Cisco Meraki MR56', Category__c = 'Hardware', Unit_Price__c = 1250, Active__c = true, Description__c = 'Wi-Fi 6 indoor access point.'),
    new Product__c(Name = 'Logitech Brio 4K Webcam', Category__c = 'Hardware', Unit_Price__c = 199, Active__c = true, Description__c = 'Ultra HD webcam for video conferencing.'),
    new Product__c(Name = 'Jabra Evolve2 85', Category__c = 'Hardware', Unit_Price__c = 350, Active__c = true, Description__c = 'Wireless ANC headset.'),
    new Product__c(Name = 'Samsung 980 PRO 2TB', Category__c = 'Hardware', Unit_Price__c = 160, Active__c = false, Description__c = 'PCIe Gen 4 NVMe M.2 SSD.'),
    new Product__c(Name = 'Anker PowerCore 26800', Category__c = 'Hardware', Unit_Price__c = 65, Active__c = true, Description__c = 'Portable charger power bank.'),

    // Software
    new Product__c(Name = 'Adobe Creative Cloud', Category__c = 'Software', Unit_Price__c = 54.99, Active__c = true, Description__c = 'Monthly subscription for creatives.'),
    new Product__c(Name = 'Microsoft 365 E5', Category__c = 'Software', Unit_Price__c = 57, Active__c = true, Description__c = 'Enterprise productivity apps and security.'),
    new Product__c(Name = 'Slack Enterprise Grid', Category__c = 'Software', Unit_Price__c = 20, Active__c = true, Description__c = 'Team communication platform.'),
    new Product__c(Name = 'Snowflake Data Cloud', Category__c = 'Software', Unit_Price__c = 5000, Active__c = true, Description__c = 'Cloud data platform base tier.'),
    new Product__c(Name = 'Tableau Creator', Category__c = 'Software', Unit_Price__c = 75, Active__c = true, Description__c = 'Visual analytics platform.'),
    new Product__c(Name = 'Docker Pro', Category__c = 'Software', Unit_Price__c = 5, Active__c = false, Description__c = 'Containerization software for devs.'),
    new Product__c(Name = 'IntelliJ IDEA Ultimate', Category__c = 'Software', Unit_Price__c = 499, Active__c = true, Description__c = 'Leading Java and Kotlin IDE.'),
    new Product__c(Name = 'Autodesk AutoCAD', Category__c = 'Software', Unit_Price__c = 1865, Active__c = true, Description__c = '2D and 3D CAD software.'),
    new Product__c(Name = 'Zoom One Enterprise', Category__c = 'Software', Unit_Price__c = 22, Active__c = true, Description__c = 'Video conferencing and UCaaS.'),
    new Product__c(Name = '1Password Business', Category__c = 'Software', Unit_Price__c = 7.99, Active__c = true, Description__c = 'Enterprise password manager.'),

    // Service
    new Product__c(Name = 'Salesforce Implementation', Category__c = 'Service', Unit_Price__c = 15000, Active__c = true, Description__c = 'End-to-end implementation package.'),
    new Product__c(Name = 'Data Migration Service', Category__c = 'Service', Unit_Price__c = 5000, Active__c = true, Description__c = 'Secure migration of legacy data.'),
    new Product__c(Name = 'AWS Cloud Consulting', Category__c = 'Service', Unit_Price__c = 200, Active__c = true, Description__c = 'Hourly rate for cloud architecture.'),
    new Product__c(Name = 'Managed IT Support', Category__c = 'Service', Unit_Price__c = 750, Active__c = true, Description__c = 'Monthly retainer for managed IT.'),
    new Product__c(Name = 'Penetration Testing', Category__c = 'Service', Unit_Price__c = 8500, Active__c = true, Description__c = 'Comprehensive security audit.'),
    new Product__c(Name = 'Custom Apex Development', Category__c = 'Service', Unit_Price__c = 150, Active__c = true, Description__c = 'Hourly rate for Salesforce development.'),
    new Product__c(Name = 'SEO Optimization Package', Category__c = 'Service', Unit_Price__c = 1200, Active__c = false, Description__c = 'Monthly SEO improvement service.'),
    new Product__c(Name = 'Agile Coaching', Category__c = 'Service', Unit_Price__c = 300, Active__c = true, Description__c = 'Hourly rate for team coaching.'),
    new Product__c(Name = 'UI/UX Design Sprint', Category__c = 'Service', Unit_Price__c = 10000, Active__c = true, Description__c = 'Two-week intensive design sprint.'),
    new Product__c(Name = 'Corporate Training - CRM', Category__c = 'Service', Unit_Price__c = 2500, Active__c = true, Description__c = 'On-site user training workshop.'),
    
    // Mixed
    new Product__c(Name = 'Heroku Private Space', Category__c = 'Service', Unit_Price__c = 4000, Active__c = true, Description__c = 'Isolated network environment.'),
    new Product__c(Name = 'MuleSoft Anypoint', Category__c = 'Software', Unit_Price__c = 12000, Active__c = true, Description__c = 'API lifecycle management.'),
    new Product__c(Name = 'YubiKey 5 NFC', Category__c = 'Hardware', Unit_Price__c = 45, Active__c = true, Description__c = 'Hardware authentication device.'),
    new Product__c(Name = 'GitHub Enterprise', Category__c = 'Software', Unit_Price__c = 21, Active__c = true, Description__c = 'Enterprise source code management.')
};

insert products;
System.debug('Inserted ' + products.size() + ' sample products.');
