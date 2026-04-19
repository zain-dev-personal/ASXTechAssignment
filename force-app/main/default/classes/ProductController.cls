public with sharing class ProductController {
    
    /**
     * @description Fetches active products, optionally filtered by category.
     * @param categoryValue Optional category name to filter by.
     * @return List of Product__c records.
     */
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(String categoryValue, Boolean includeInactive) {
        String query = 'SELECT Id, Name, Category__c, Unit_Price__c, Active__c, Description__c, Product_Image_Id__c FROM Product__c';
        
        List<String> conditions = new List<String>();
        
        if (includeInactive == null || !includeInactive) {
            conditions.add('Active__c = true');
        }
        
        if (String.isNotBlank(categoryValue)) {
            conditions.add('Category__c = :categoryValue');
        }
        
        if (!conditions.isEmpty()) {
            query += ' WHERE ' + String.join(conditions, ' AND ');
        }
        
        query += ' WITH USER_MODE ORDER BY Name ASC';
        
        return Database.query(query);
    }

    /**
     * @description Updates the active status of a product.
     * @param productId Id of the product to update.
     * @param isActive New active status.
     */
    @AuraEnabled
    public static void updateProductStatus(Id productId, Boolean isActive) {
        try {
            Product__c prod = new Product__c(Id = productId, Active__c = isActive);
            update as user prod;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating product status: ' + e.getMessage());
        }
    }

    /**
     * @description Fetches all related price history records for a given product.
     * @param productId Id of the product.
     * @return List of Price_History__c records.
     */
    @AuraEnabled(cacheable=true)
    public static List<Price_History__c> getPriceHistories(Id productId) {
        return [
            SELECT Id, Old_Price__c, New_Price__c, Date_Changed__c 
            FROM Price_History__c 
            WHERE Product__c = :productId 
            WITH USER_MODE 
            ORDER BY Date_Changed__c DESC
        ];
    }
}
