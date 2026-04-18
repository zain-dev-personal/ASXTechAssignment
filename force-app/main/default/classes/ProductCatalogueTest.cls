@IsTest
private class ProductCatalogueTest {
    
    @TestSetup
    static void setup() {
        List<Product__c> products = new List<Product__c>();
        products.add(new Product__c(Name = 'HW Product', Category__c = 'Hardware', Unit_Price__c = 100, Active__c = true));
        products.add(new Product__c(Name = 'SW Product', Category__c = 'Software', Unit_Price__c = 200, Active__c = true));
        products.add(new Product__c(Name = 'Hidden Product', Category__c = 'Hardware', Unit_Price__c = 50, Active__c = false));
        insert products;
    }

    @IsTest
    static void testGetProductsAll() {
        Test.startTest();
        List<Product__c> results = ProductController.getProducts(null, false);
        Test.stopTest();
        
        Assert.areEqual(2, results.size(), 'Should return only active products by default');
    }

    @IsTest
    static void testGetProductsWithInactive() {
        Test.startTest();
        List<Product__c> results = ProductController.getProducts(null, true);
        Test.stopTest();
        
        Assert.areEqual(3, results.size(), 'Should return all products including inactive');
    }

    @IsTest
    static void testGetProductsFiltered() {
        Test.startTest();
        List<Product__c> results = ProductController.getProducts('Software', false);
        Test.stopTest();
        
        Assert.areEqual(1, results.size(), 'Should return only software products');
        Assert.areEqual('SW Product', results[0].Name, 'Should match the name');
    }

    @IsTest
    static void testUpdateProductStatus() {
        Product__c prod = [SELECT Id, Active__c FROM Product__c WHERE Name = 'HW Product' LIMIT 1];
        
        Test.startTest();
        ProductController.updateProductStatus(prod.Id, false);
        Test.stopTest();
        
        Product__c updatedProd = [SELECT Id, Active__c FROM Product__c WHERE Id = :prod.Id];
        Assert.isFalse(updatedProd.Active__c, 'Product should be deactivated');
    }

    @IsTest
    static void testPriceHistoryTrigger() {
        Product__c prod = [SELECT Id, Unit_Price__c FROM Product__c WHERE Name = 'HW Product' LIMIT 1];
        
        Test.startTest();
        prod.Unit_Price__c = 150;
        update prod;
        Test.stopTest();
        
        List<Price_History__c> histories = [SELECT Id, Old_Price__c, New_Price__c FROM Price_History__c WHERE Product__c = :prod.Id];
        Assert.areEqual(1, histories.size(), 'Price history record should be created');
        Assert.areEqual(100, histories[0].Old_Price__c, 'Old price match');
        Assert.areEqual(150, histories[0].New_Price__c, 'New price match');
    }

    @IsTest
    static void testInvalidPriceValidation() {
        Product__c prod = new Product__c(Name = 'Bad Product', Category__c = 'Hardware', Unit_Price__c = 0, Active__c = true);
        
        Test.startTest();
        try {
            insert prod;
            Assert.fail('Validation rule should have prevented insert');
        } catch (DmlException e) {
            Assert.isTrue(e.getMessage().contains('Unit price must be greater than zero'), 'Correct validation message returned');
        }
        Test.stopTest();
    }

    @IsTest
    static void testGetPriceHistories() {
        Product__c prod = [SELECT Id, Unit_Price__c FROM Product__c WHERE Name = 'HW Product' LIMIT 1];
        
        Test.startTest();
        prod.Unit_Price__c = 150;
        update prod;
        
        List<Price_History__c> histories = ProductController.getPriceHistories(prod.Id);
        Test.stopTest();
        
        Assert.areEqual(1, histories.size(), 'Should return one price history record');
        Assert.areEqual(100, histories[0].Old_Price__c, 'Old price match');
        Assert.areEqual(150, histories[0].New_Price__c, 'New price match');
    }
}
